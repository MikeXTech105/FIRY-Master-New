using Dapper;
using FIRYMaster.API.Configuration;
using FIRYMaster.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Data;

namespace FIRYMaster.API.Extensions
{
    public class EmailBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly EmailJobOptions _emailJobOptions;
        private readonly SmtpOptions _smtpOptions;
        private readonly ILogger<EmailBackgroundService> _logger;

        public EmailBackgroundService(
            IServiceScopeFactory serviceScopeFactory,
            IOptions<EmailJobOptions> emailJobOptions,
            IOptions<SmtpOptions> smtpOptions,
            ILogger<EmailBackgroundService> logger)
        {
            _scopeFactory = serviceScopeFactory;
            _emailJobOptions = emailJobOptions.Value;
            _smtpOptions = smtpOptions.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var intervalHours = Math.Max(1, _emailJobOptions.RunEveryHours);
            _logger.LogInformation("Email background service started with interval {IntervalHours} hour(s)", intervalHours);

            while (!stoppingToken.IsCancellationRequested)
            {
                var delay = GetDelayToNextRun(intervalHours);
                _logger.LogInformation("Next email worker run scheduled in {Delay}", delay);

                await Task.Delay(delay, stoppingToken);
                await ProcessEmails(stoppingToken);
            }
        }

        private static TimeSpan GetDelayToNextRun(int intervalHours)
        {
            var now = DateTime.UtcNow;
            var nextRun = new DateTime(now.Year, now.Month, now.Day, now.Hour, 0, 0, DateTimeKind.Utc)
                .AddHours(intervalHours);

            return nextRun - now;
        }

        private async Task ProcessEmails(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is not configured.");

            using var con = new SqlConnection(connectionString);

            var emails = (await con.QueryAsync<EmailQueue>(
                "sp_GetEmailsToSend",
                commandType: CommandType.StoredProcedure)).ToList();

            _logger.LogInformation("Fetched {Count} email(s) from queue", emails.Count);

            foreach (var email in emails)
            {
                cancellationToken.ThrowIfCancellationRequested();

                try
                {
                    var sendResult = await SendEmail(email, cancellationToken);
                    var status = sendResult.Item1 ? 2 : 3;

                    await con.ExecuteAsync(
                        @"UPDATE EmailQueue
                          SET appSentAt = GETDATE(),
                              appStatus = @Status,
                              appMessage = @Message
                          WHERE appId = @Id",
                        new { Id = email.appId, Status = status, Message = sendResult.Item2 });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process email queue item {QueueId}", email.appId);

                    await con.ExecuteAsync(
                        @"UPDATE EmailQueue
                          SET appSentAt = GETDATE(),
                              appStatus = 3,
                              appMessage = @Message,
                              appRetryCount = ISNULL(appRetryCount, 0) + 1
                          WHERE appId = @Id",
                        new { Id = email.appId, Message = ex.Message });
                }

                var delaySeconds = _emailJobOptions.MaxRandomDelaySecondsBetweenEmails;
                if (delaySeconds > 0)
                {
                    await Task.Delay(TimeSpan.FromSeconds(Random.Shared.Next(1, delaySeconds + 1)), cancellationToken);
                }
            }
        }

        private async Task<Tuple<bool, string>> SendEmail(EmailQueue email, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email.appFromEmail) ||
                    string.IsNullOrWhiteSpace(email.appPassword) ||
                    string.IsNullOrWhiteSpace(email.appToEmail))
                {
                    return new Tuple<bool, string>(false, "Email credentials or recipient missing.");
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(email.appFromEmail, email.appFromEmail));
                message.To.Add(MailboxAddress.Parse(email.appToEmail));
                message.Subject = email.appSubject ?? string.Empty;

                var builder = new BodyBuilder { TextBody = email.appBody ?? string.Empty };

                if (!string.IsNullOrWhiteSpace(email.appFilePath))
                {
                    var relativePath = email.appFilePath.TrimStart('/');
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

                    if (File.Exists(fullPath))
                    {
                        builder.Attachments.Add(fullPath);
                    }
                }

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();
                client.CheckCertificateRevocation = false;

                var socketOptions = _smtpOptions.UseStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;

                await client.ConnectAsync(_smtpOptions.Host, _smtpOptions.Port, socketOptions, cancellationToken);
                await client.AuthenticateAsync(email.appFromEmail, email.appPassword, cancellationToken);
                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);
            }
            catch (AuthenticationException ex)
            {
                return new Tuple<bool, string>(false, $"SMTP authentication failed: {ex.Message}");
            }
            catch (SmtpCommandException ex)
            {
                return new Tuple<bool, string>(false, $"SMTP command error ({ex.StatusCode}): {ex.Message}");
            }
            catch (SmtpProtocolException ex)
            {
                return new Tuple<bool, string>(false, $"SMTP protocol error: {ex.Message}");
            }
            catch (OperationCanceledException)
            {
                return new Tuple<bool, string>(false, "Service cancellation requested.");
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string>(false, ex.Message);
            }

            return new Tuple<bool, string>(true, "Success");
        }
    }
}
