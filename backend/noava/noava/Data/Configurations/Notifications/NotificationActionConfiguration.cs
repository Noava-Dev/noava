using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Notifications
{
    public class NotificationActionConfiguration : IEntityTypeConfiguration<NotificationAction>
    {
        public void Configure(EntityTypeBuilder<NotificationAction> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.NotificationId)
                   .IsRequired();
            builder.Property(a => a.LabelKey)
                   .IsRequired();
            builder.Property(a => a.Endpoint)
                   .IsRequired();
            builder.Property(a => a.Method)
                    .HasConversion<string>()
                   .IsRequired();
            builder.HasOne(a => a.Notification)
                   .WithMany(n => n.Actions)
                   .HasForeignKey(a => a.NotificationId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
