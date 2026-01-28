using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class SchoolAdminConfiguration : IEntityTypeConfiguration<SchoolAdmin>
    {
        public void Configure(EntityTypeBuilder<SchoolAdmin> builder)
        {
            builder.HasKey(sa => new { sa.SchoolId, sa.UserId });

            // Relationships
            builder.HasOne(sa => sa.School)
                   .WithMany(s => s.SchoolAdmins)
                   .HasForeignKey(sa => sa.SchoolId);

            builder.HasOne(sa => sa.User)
                   .WithMany()
                   .HasForeignKey(sa => sa.UserId);
        }
    }
}
