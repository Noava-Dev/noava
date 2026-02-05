using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Schools
{
    public class SchoolAdminConfiguration : IEntityTypeConfiguration<SchoolAdmin>
    {
        public void Configure(EntityTypeBuilder<SchoolAdmin> builder)
        {
            builder.HasKey(sa => new { sa.SchoolId, sa.ClerkId });

            builder.Property(sa => sa.ClerkId)
                   .IsRequired();

            builder.HasOne(sa => sa.School)
                   .WithMany(s => s.SchoolAdmins)
                   .HasForeignKey(sa => sa.SchoolId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sa => sa.User)
                   .WithMany()
                   .HasForeignKey(sa => sa.ClerkId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
