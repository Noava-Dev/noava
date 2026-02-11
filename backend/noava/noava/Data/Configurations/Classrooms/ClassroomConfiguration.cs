using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Classrooms
{
    public class ClassroomConfiguration : IEntityTypeConfiguration<Classroom>
    {
        public void Configure(EntityTypeBuilder<Classroom> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(500);
            builder.Property(c => c.JoinCode)
                .IsRequired();
            builder.HasIndex(c => c.JoinCode)
                .IsUnique();
            builder.Property(c => c.CreatedAt)
                .IsRequired();
            builder.Property(c => c.UpdatedAt)
                .IsRequired();
            builder.HasOne(c => c.School)
                .WithMany()
                .HasForeignKey(c => c.SchoolId)
                .IsRequired(false);
        }
    }
}
