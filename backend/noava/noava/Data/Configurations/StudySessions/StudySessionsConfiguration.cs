using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.StudySessions
{
    public class StudySessionsConfiguration : IEntityTypeConfiguration<StudySession>
    {
        public void Configure(EntityTypeBuilder<StudySession> builder)
        {
            builder.HasKey(b => b.Id);

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(d => d.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Deck>()
                .WithMany()
                .HasForeignKey(d => d.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(b => b.StartTime)
                .IsRequired();

            builder.Property(b => b.EndTime)
                .HasDefaultValueSql("now()")
                .IsRequired();

            builder.Property(b => b.TotalCards)
                .IsRequired();

            builder.Property(b => b.CorrectCount)
                .IsRequired();

            builder.ToTable(b =>
            {
                b.HasCheckConstraint("CK_StudySessions_CorrectCount", "\"CorrectCount\" >= 0 AND \"CorrectCount\" <= \"TotalCards\"");
                b.HasCheckConstraint("CK_StartTime_EndTime", "\"EndTime\" >= \"StartTime\"");
            });
        }
    }
}
