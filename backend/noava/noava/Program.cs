using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using noava.Data;
using noava.Data.Seeders;
using noava.Exceptions;
using noava.Repositories;
using noava.Repositories.Cards;
using noava.Repositories.Classrooms;
using noava.Repositories.ContactMessages;
using noava.Repositories.Decks;
using noava.Repositories.FAQs;
using noava.Repositories.Implementations;
using noava.Repositories.Notifications;
using noava.Repositories.Schools;
using noava.Repositories.Statistics;
using noava.Repositories.StudySessions;
using noava.Repositories.Users;
using noava.Services;
using noava.Services.Cards;
using noava.Services.Classrooms;
using noava.Services.ContactMessages;
using noava.Services.Decks;
using noava.Services.Emails;
using noava.Services.FAQs;
using noava.Services.Implementations;
using noava.Services.Notifications;
using noava.Services.Schools;
using noava.Services.Statistics.Classrooms;
using noava.Services.Statistics.Decks;
using noava.Services.Statistics.General;
using noava.Services.StudySessions;
using noava.Services.Users;
using noava.Shared;
using System.Security.Claims;
using System.Threading.RateLimiting;

namespace noava
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add DbContext
            builder.Services.AddDbContext<NoavaDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("NoavaDatabaseLocal")));

            // Repository Registrations
            builder.Services.AddScoped<IFaqRepository, FaqRepository>();
            builder.Services.AddScoped<IContactMessageRepository, ContactMessageRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IDeckRepository, DeckRepository>();
            builder.Services.AddScoped<ICardRepository, CardRepository>();
            builder.Services.AddScoped<IClassroomRepository, ClassroomRepository>();
            builder.Services.AddScoped<IClassroomDeckRepository, ClassroomDeckRepository>();
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
            builder.Services.AddScoped<IDeckUserRepository, DeckUserRepository>();
            builder.Services.AddScoped<IDeckInvitationRepository, DeckInvitationRepository>();
            builder.Services.AddScoped<ISchoolRepository, SchoolRepository>();
            builder.Services.AddScoped<ICardInteractionRepository, CardInteractionRepository>();
            builder.Services.AddScoped<ICardProgressRepository, CardProgressRepository>();
            builder.Services.AddScoped<IStudySessionRepository, StudySessionRepository>();
            builder.Services.AddScoped<IStatisticsRepository, StatisticsRepository>();

            // Service Registrations
            builder.Services.AddScoped<IFaqService, FaqService>();
            builder.Services.AddScoped<IContactMessageService, ContactMessageService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IDeckService, DeckService>();
            builder.Services.AddScoped<ICardService, CardService>();
            builder.Services.AddScoped<IDeckInvitationService, DeckInvitationService>();
            builder.Services.AddScoped<IDeckOwnershipService, DeckOwnershipService>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddScoped<ISchoolService, SchoolService>();
            builder.Services.AddScoped<ILeitnerBoxService, LeitnerBoxService>();
            builder.Services.AddScoped<IClassroomService, ClassroomService>();
            builder.Services.AddScoped<IBlobService, BlobService>();
            builder.Services.AddScoped<ICardImportService, CardImportService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IStudySessionService, StudySessionService>();
            builder.Services.AddScoped<ICardInteractionService, CardInteractionService>();
            builder.Services.AddScoped<IStatsService, StatsService>();
            builder.Services.AddScoped<IDeckStatsService, DeckStatsService>();
            builder.Services.AddScoped<IClassroomsStatsService, ClassroomsStatsService>();

            // External Service Registrations
            builder.Services.AddHttpClient();
            builder.Services.AddScoped<IClerkService, ClerkService>();
            builder.Services.AddScoped<IAggregateStatisticsService, AggregateStatisticsService>();
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend",
                    policy => policy
                    .WithOrigins("*")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                );
            });

            builder.Services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(
                        new System.Text.Json.Serialization.JsonStringEnumConverter()
                    );
                });

            builder.Services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("contact-messages", opt =>
                {
                    opt.PermitLimit = 5;
                    opt.Window = TimeSpan.FromSeconds(30);
                    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    opt.QueueLimit = 2;
                });
            });

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5000);

                if (builder.Environment.IsDevelopment())
                {
                    options.ListenAnyIP(5001, listenOptions =>
                    {
                        listenOptions.UseHttps();
                    });
                }
            });

            var clerkAuthority = builder.Configuration["Clerk:FrontendApiUrl"];

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = clerkAuthority;
                    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RoleClaimType = ClaimTypes.Role
                    };
                });

            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // seed faqs
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<NoavaDbContext>();

                if (app.Environment.IsDevelopment())
                    dbContext.Database.Migrate();

                FAQSeeder.SeedOrUpdateFAQs(dbContext);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseExceptionHandler(_ => { });

            app.UseCors("Frontend");
            app.UseRateLimiter();

            app.UseAuthentication();
            app.UseMiddleware<RoleClaimsMiddleware>();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}