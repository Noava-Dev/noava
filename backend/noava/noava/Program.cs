
using Microsoft.EntityFrameworkCore;
using noava.Data;

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

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend",
                    policy => policy
                    .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                );
            });

            builder.Services.AddControllers();

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenLocalhost(5000);

                options.ListenLocalhost(5001, listenOptions =>
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
