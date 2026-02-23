using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models.AggregateStatistics;

namespace noava.Data.Configurations.AggregateStatistics
{
    public class DeckUserStatisticsConfiguration : IEntityTypeConfiguration<DeckUserStatistics>
    {
        public void Configure(EntityTypeBuilder<DeckUserStatistics> builder)
        {
            builder.HasKey(e => new { e.DeckId, e.ClerkId });

            builder.Property(e => e.AvgMasteryLevel).HasColumnType("decimal(5,2)");

            builder.HasOne(e => e.Deck)
                .WithMany()
                .HasForeignKey(e => e.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
