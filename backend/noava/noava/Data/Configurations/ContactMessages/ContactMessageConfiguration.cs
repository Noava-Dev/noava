using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.ContactMessages
{
    public class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
    {
        public void Configure(EntityTypeBuilder<ContactMessage> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title)
                .IsRequired()
                .HasConversion<string>();
            builder.Property(x => x.Subject)
                .IsRequired()
                .HasConversion<string>();
            builder.Property(x => x.SenderEmail)
                .IsRequired()
                .HasMaxLength(255);
            builder.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(4000);
            builder.Property(x => x.CreatedAt)
                .IsRequired();
        }
    }
}