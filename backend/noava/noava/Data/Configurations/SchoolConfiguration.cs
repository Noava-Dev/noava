using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class SchoolConfiguration : IEntityTypeConfiguration<School>
    {
        public void Configure(EntityTypeBuilder<School> builder)
        {
            //declare primary key
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
            .isRequired()
            .HasMaxLength(200);

            //a school shouldn't exist twice by the same name
            builder.HasIndex(s => s.Name)
            .IsUnique()

            builder.Property(s => s.Description)
            .HasMaxLength(1000);

        }
    }
}