using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class SchoolConfiguration : IEntityTypeConfiguration<School>
    {
        public void Configure(EntityTypeBuilder<School> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.HasIndex(s => s.Name)
                   .IsUnique();

            builder.Property(s => s.CreatedByUserId)
                   .IsRequired();

            builder.HasOne(s => s.CreatedBy)
                   .WithMany()
                   .HasForeignKey(s => s.CreatedByUserId);

            builder.HasMany(s => s.SchoolAdmins)
                   .WithOne(sa => sa.School)
                   .HasForeignKey(sa => sa.SchoolId);

            builder.Property(s => s.CreatedAt)
                   .IsRequired();

            builder.Property(s => s.UpdatedAt)
                   .IsRequired();
        }
    }
}
