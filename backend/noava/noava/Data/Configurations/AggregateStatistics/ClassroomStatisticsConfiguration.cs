using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models.AggregateStatistics;

namespace noava.Data.Configurations.AggregateStatistics
{
    public class ClassroomStatisticsConfiguration : IEntityTypeConfiguration<ClassroomStatistics>
    {
        public void Configure(EntityTypeBuilder<ClassroomStatistics> builder)
        {
            builder.HasKey(cs => cs.ClassroomId);

            builder.HasMany(cs => cs.ActiveUsers)
                .WithMany(u => u.ClassroomStatistics);

            builder.HasOne(cs => cs.Classroom)
                .WithOne()
                .HasForeignKey<ClassroomStatistics>(cs => cs.ClassroomId)
                .IsRequired();

            builder.Property(e => e.AvgMasteryLevel).HasColumnType("decimal(5,2)");
        }
    }
}
