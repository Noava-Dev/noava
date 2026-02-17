using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models.AggregateStatistics;

namespace noava.Data.Configurations.AggregateStatistics
{
    public class ClassroomDeckStatisticsConfiguration : IEntityTypeConfiguration<ClassroomDeckStatistics>
    {
        public void Configure(EntityTypeBuilder<ClassroomDeckStatistics> builder)
        {
            builder.HasKey(e => new { e.ClassroomId, e.DeckId });

            builder.Property(e => e.AccuracyRate).HasColumnType("decimal(5,2)");
            builder.Property(e => e.AvgMasteryLevel).HasColumnType("decimal(5,2)");

            builder.HasOne(e => e.Classroom)
                .WithMany()
                .HasForeignKey(e => e.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Deck)
                .WithMany()
                .HasForeignKey(e => e.DeckId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
