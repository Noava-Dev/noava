using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Cards
{
    public class CardInteractionsConfiguration : IEntityTypeConfiguration<CardInteraction>
    {
        public void Configure(EntityTypeBuilder<CardInteraction> builder)
        {
            builder.HasKey(d => d.Id);

            builder.HasOne<Card>()
                .WithMany()
                .HasForeignKey(d => d.CardId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(d => d.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Models.StudySession>()
                .WithMany()
                .HasForeignKey(d => d.StudySessionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Deck>()
                .WithMany()
                .HasForeignKey(d => d.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(d => d.Timestamp)
                .HasDefaultValueSql("now()")
                .IsRequired();

            builder.Property(d => d.IsCorrect)
                .IsRequired();

            builder.Property(d => d.ResponseTimeMs)
                .IsRequired();

            builder.Property(d => d.StudyMode)
                .IsRequired();

            builder.Property(d => d.IntervalBefore)
                .IsRequired();

            builder.Property(d => d.IntervalAfter)
                .IsRequired();

            builder.Property(d => d.DueAtBefore)
                .IsRequired();

            builder.Property(d => d.DueAtAfter)
                .IsRequired();

            builder.ToTable(b =>
            {
                b.HasCheckConstraint("CK_CardInteractions_ResponseTimeMs_NonNegative", "\"ResponseTimeMs\" >= 0");
            });
        }
    }
}
