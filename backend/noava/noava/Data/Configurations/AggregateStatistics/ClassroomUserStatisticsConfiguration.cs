using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models.AggregateStatistics;

namespace noava.Data.Configurations.AggregateStatistics
{
    public class ClassroomUserStatisticsConfiguration : IEntityTypeConfiguration<ClassroomUserStatistics>
    {
        public void Configure(EntityTypeBuilder<ClassroomUserStatistics> builder)
        {
            builder.HasKey(e => new { e.ClassroomId, e.ClerkId });

            builder.Property(e => e.AccuracyRate).HasColumnType("decimal(5,2)");
            builder.Property(e => e.AvgMasteryLevel).HasColumnType("decimal(5,2)");

            builder.HasOne(e => e.Classroom)
                .WithMany()
                .HasForeignKey(e => e.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
