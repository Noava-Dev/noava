
using Microsoft.EntityFrameworkCore;
using noava.Data;
using Noava.Repositories;
using noava.Services;

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

            // FAQ
            builder.Services.AddScoped<FaqRepository>();
            builder.Services.AddScoped<FaqService>();
            

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

                options.ListenAnyIP(5001, listenOptions =>
                {
                    listenOptions.UseHttps();
                });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("Frontend");

            app.MapControllers();

            app.Run();
        }
    }
}
