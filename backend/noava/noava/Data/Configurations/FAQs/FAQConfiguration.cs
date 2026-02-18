using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.FAQs
{
    public class FAQConfiguration : IEntityTypeConfiguration<FAQ>
    {
        public void Configure(EntityTypeBuilder<FAQ> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Question)
                .IsRequired();
            builder.Property(d => d.Answer)
                .IsRequired();
            builder.Property(d => d.FaqKey)
                .IsRequired();
        }
    }
}