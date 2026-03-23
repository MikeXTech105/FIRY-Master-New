using Dapper;
using FIRYMaster.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Data.SqlClient;
using MimeKit;
using System.Data;

namespace FIRYMaster.API.Extensions
{
    public class EmailBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;

        public EmailBackgroundService(IServiceScopeFactory serviceScopeFactory, IConfiguration configuration)
        {
            _scopeFactory = serviceScopeFactory;
            _configuration = configuration;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            int intervalHours = _configuration.GetValue<int>("EmailJob:RunEveryHours");

            while (!stoppingToken.IsCancellationRequested)
            {
                var delay = GetDelayToNextRun(intervalHours);

                await Task.Delay(delay, stoppingToken);

                await ProcessEmails();
            }
        }

        private TimeSpan GetDelayToNextRun(int intervalHours)
        {
            var now = DateTime.Now;

            // next exact hour (2:00, 3:00…)
            var nextRun = new DateTime(
                now.Year,
                now.Month,
                now.Day,
                now.Hour,
                0,
                0
            ).AddHours(intervalHours);

            return nextRun - now;
        }

        private async Task ProcessEmails()
        {
            using var scope = _scopeFactory.CreateScope();
            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            using var con = new SqlConnection(
                config.GetConnectionString("DefaultConnection")
            );

            var emails = (await con.QueryAsync<EmailQueue>(
                "sp_GetEmailsToSend",
                commandType: CommandType.StoredProcedure
            )).ToList();

            foreach (var email in emails)
            {
                try
                {
                    // 🔹 Send email (you plug your logic here)
                    var emailsent = await SendEmail(email);

                    // 🔹 Mark as sent
                    if (emailsent.Item1)
                    {
                        await con.ExecuteAsync(
                            @"UPDATE EmailQueue 
                      SET appSentAt = GETDATE(),
                          appStatus = 2,
                          appMessage = @Message
                      WHERE appId = @Id",
                            new { Id = email.appId, Message = emailsent.Item2 }
                        );
                    }
                    else
                    {
                        await con.ExecuteAsync(
                            @"UPDATE EmailQueue 
                      SET appSentAt = GETDATE(),
                          appStatus = 3,
                          appMessage = @Message
                      WHERE appId = @Id",
                            new { Id = email.appId, Message = emailsent.Item2 }
                        );
                    }
                }
                catch(Exception ex)
                {
                    await con.ExecuteAsync(
                           @"UPDATE EmailQueue 
                      SET appSentAt = GETDATE(),
                          appStatus = 3,
                          appMessage = @Message
                      WHERE appId = @Id",
                           new { Id = email.appId, Message = ex.Message }
                       );

                    //  // 🔹 Retry count
                    //  await con.ExecuteAsync(
                    //      @"UPDATE EmailQueue 
                    //SET appRetryCount = appRetryCount + 1
                    //WHERE appId = @Id",
                    //      new { Id = email.appId }
                    //  );
                }
                Random rnd = new Random();
                await Task.Delay(TimeSpan.FromSeconds(rnd.Next(1,21)));
            }
            Console.WriteLine($"Running at: {DateTime.Now}");
        }
        private async Task<Tuple<bool, string>> SendEmail(EmailQueue email, CancellationToken cancellationToken = default)
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
                message.Subject = email.appSubject ?? "";

                var builder = new BodyBuilder
                {
                    TextBody = email.appBody ?? ""
                };

                if (!string.IsNullOrWhiteSpace(email.appFilePath))
                {
                    // Remove starting "/" to avoid wrong path combine
                    var relativePath = email.appFilePath.TrimStart('/');

                    // Get absolute path (same base where you saved file)
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

                    if (File.Exists(fullPath))
                    {
                        builder.Attachments.Add(fullPath);
                    }
                }

                message.Body = builder.ToMessageBody();

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.CheckCertificateRevocation = false;

                    await client.ConnectAsync(
                        "smtp.gmail.com",
                        587,
                        SecureSocketOptions.StartTls,
                        cancellationToken);

                    await client.AuthenticateAsync(
                        email.appFromEmail,
                        email.appPassword,
                        cancellationToken);

                    await client.SendAsync(message, cancellationToken);

                    await client.DisconnectAsync(true, cancellationToken);
                }
            }
            catch (AuthenticationException ex)
            {
                return new Tuple<bool, string>(false, $"SMTP Authentication failed for {email.appFromEmail}: {ex.Message}");
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
                return new Tuple<bool, string>(false, "Happens during shutdown — do not treat as failure");
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string>(false, ex.Message);
            }
            return new Tuple<bool, string>(true, "Success");
        }
    }
}
