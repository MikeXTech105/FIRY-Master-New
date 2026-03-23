using FIRYMaster.Application.Interfaces;
using FIRYMaster.Application.Services;
using FIRYMaster.Infrastructure.Persistence.DbConnection;
using FIRYMaster.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Infrastructure.DependencyInjection
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddSingleton<DapperContext>();

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<AuthService>();

            services.AddScoped<IRoleRepository, RoleRepository>();

            services.AddScoped<RoleService>();

            services.AddScoped<ICandidateRepository, CandidateRepository>();

            services.AddScoped<CandidateService>();

            services.AddScoped<IEmailRepository, EmailRepository>();

            services.AddScoped<EmailService>();

            services.AddScoped<IEmailSettingsRepository, EmailSettingsRepository>();

            services.AddScoped<EmailSettingsService>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();

            services.AddScoped<DashboardService>();

            return services;
        }
    }
}
