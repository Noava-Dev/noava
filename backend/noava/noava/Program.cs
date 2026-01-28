using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using noava.Data;
using noava.Repositories;
using noava.Repositories.Contracts;
using noava.Repositories.Implementations;
using noava.Services;
using noava.Services.Contracts;
using noava.Services.Implementations;
using noava.Shared;
using Microsoft.IdentityModel.JsonWebTokens;
using noava.Services.Interfaces;
using noava.Repositories.Interfaces;

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

            builder.Services.AddScoped<IFaqRepository, FaqRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IDeckRepository, DeckRepository>();
            builder.Services.AddScoped<ICardRepository, CardRepository>();

            builder.Services.AddScoped<IFaqService, FaqService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IDeckService, DeckService>();
            builder.Services.AddScoped<IBlobService, BlobService>();
            builder.Services.AddScoped<ICardService, CardService>();



            builder.Services.AddScoped<ILeitnerBoxService, LeitnerBoxService>();



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

            builder.Services.AddControllers();

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
                        ClockSkew = TimeSpan.FromMinutes(5),

                
                    };

                });

            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
		        //app.UseHttpsRedirection();
            }

            app.UseCors("Frontend");

            app.UseAuthentication();
            app.UseMiddleware<RoleClaimsMiddleware>();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
