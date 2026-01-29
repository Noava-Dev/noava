using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(d => d.ClerkId);
            builder.Property(d => d.Role)
                .HasConversion<string>()
                .IsRequired();
            builder.HasMany(u => u.Notifications)
                   .WithOne(n => n.User)
                   .HasForeignKey(n => n.UserId)
                   .HasPrincipalKey(u => u.ClerkId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
