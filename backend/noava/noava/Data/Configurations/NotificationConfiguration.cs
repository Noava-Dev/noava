using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Type)
                .HasConversion<string>()
                .IsRequired();
            builder.Property(d => d.TemplateKey)
                .IsRequired();
            builder.Property(d => d.ParametersJson);
            builder.Property(d => d.Link);
            builder.Property(d => d.CreatedAt)
                .IsRequired();
            builder.HasOne(n => n.User)
               .WithMany(u => u.Notifications)
               .HasForeignKey(n => n.UserId)
               .HasPrincipalKey(u => u.ClerkId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(n => n.Actions)
                   .WithOne(a => a.Notification)
                   .HasForeignKey(a => a.NotificationId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
