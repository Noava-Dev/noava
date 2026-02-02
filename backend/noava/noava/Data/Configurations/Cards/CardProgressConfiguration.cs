using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Cards
{
    public class CardProgressConfiguration : IEntityTypeConfiguration<CardProgress>
    {
        public void Configure(EntityTypeBuilder<CardProgress> builder)
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

            builder.Property(d => d.NextReviewDate)
                .IsRequired();

            builder.Property(d => d.BoxNumber)
                .HasDefaultValue(1)
                .IsRequired();

            builder.Property(d => d.LastReviewedAt)
                .IsRequired();

            builder.Property(d => d.CorrectCount)
                .HasDefaultValue(0)
                .IsRequired();

            builder.Property(d => d.IncorrectCount)
                .HasDefaultValue(0)
                .IsRequired();

            builder.Property(d => d.Streak)
                .HasDefaultValue(0)
                .IsRequired();

            builder.ToTable(b =>
            {
                b.HasCheckConstraint("CK_CardProgress_BoxNumber_NonNegative", "\"BoxNumber\" >= 1 AND \"BoxNumber\" <= 5");
                b.HasCheckConstraint("CK_CardProgress_Counts_NonNegative", "\"CorrectCount\" >= 0 AND \"IncorrectCount\" >= 0 AND \"Streak\" >= 0");
            });
        }
    }
}
