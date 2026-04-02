using FIRYMaster.API.Configuration;
using FIRYMaster.API.Extensions;
using FIRYMaster.API.Middleware;
using FIRYMaster.API.Services;
using FIRYMaster.Infrastructure.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ==============================
// Add Controllers & API Explorer
// ==============================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


// ==============================
// Swagger Configuration
// - Enables Swagger UI
// - Adds JWT Authentication support in Swagger
// ==============================
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FIRYMaster API",
        Version = "v1"
    });

    // JWT Security Definition
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    // Apply JWT globally to Swagger
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// ==============================
// Global Problem Details Handling
// ==============================
builder.Services.AddProblemDetails();


// ==============================
// Configuration Binding
// (Strongly Typed Options Pattern)
// ==============================
builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection(JwtOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services
    .AddOptions<CorsOptions>()
    .Bind(builder.Configuration.GetSection(CorsOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services
    .AddOptions<EmailJobOptions>()
    .Bind(builder.Configuration.GetSection(EmailJobOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services
    .AddOptions<FileUploadOptions>()
    .Bind(builder.Configuration.GetSection(FileUploadOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services
    .AddOptions<SmtpOptions>()
    .Bind(builder.Configuration.GetSection(SmtpOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();


// ==============================
// JWT Authentication Setup
// ==============================
var jwtSettings = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("JWT configuration is missing.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,

            ClockSkew = TimeSpan.FromMinutes(1),

            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });

builder.Services.AddAuthorization();


// ==============================
// CORS Configuration
// ==============================
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ==============================
// Dependency Injection
// ==============================
builder.Services.AddInfrastructure();
builder.Services.AddScoped<IResumeStorageService, ResumeStorageService>();


// ==============================
// Background Email Service
// ==============================
builder.Services.AddHostedService<EmailBackgroundService>();


var app = builder.Build();


// ==============================
// Global Exception Middleware
// ==============================
// app.UseGlobalExceptionHandling();


// ==============================
// Enable Swagger
// (Enabled for Dev + Production for testing)
// ==============================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FIRYMaster API V1");
    c.RoutePrefix = "swagger";
});


// ==============================
// Middleware Pipeline
// ==============================
app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();


// ==============================
// Map API Controllers
// ==============================
app.MapControllers();


// ==============================
// React SPA Fallback
// (Important when React + API hosted together)
// ==============================
app.MapFallbackToFile("index.html");


// ==============================
// Run Application
// ==============================
app.Run();