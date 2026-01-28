using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using noava.Models;

namespace noava.Data.Configurations
{
    public class CardConfiguration : IEntityTypeConfiguration<Card>
    {
        public void Configure(EntityTypeBuilder<Card> builder)
        {
            builder.HasKey(d => d.Id);

            builder.HasOne<Deck>()
                .WithMany()
                .HasForeignKey(d => d.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(d => d.FrontText)
                .IsRequired();

            builder.Property(d => d.BackText)
                .IsRequired();

            builder.Property(d => d.FrontImage);

            builder.Property(d => d.BackImage);

            builder.Property(d => d.FrontAudio);

            builder.Property(d => d.BackAudio);

            builder.Property(d => d.Memo)
                .IsRequired();

            builder.Property(d => d.CreatedAt)
                .HasDefaultValueSql("now()")
                .IsRequired();

            builder.Property(d => d.UpdatedAt)
                .HasDefaultValueSql("now()")
                .IsRequired();
        }
    }
}
