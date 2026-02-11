using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.Classrooms
{
    public class ClassroomDeckConfiguration : IEntityTypeConfiguration<ClassroomDeck>
    {
        public void Configure(EntityTypeBuilder<ClassroomDeck> builder)
        {
            builder.HasKey(cu => new { cu.ClassroomId, cu.DeckId });
            builder.HasOne(cu => cu.Classroom)
                .WithMany(c => c.ClassroomDecks)
                .HasForeignKey(cu => cu.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(cu => cu.Deck)
                .WithMany(u => u.ClassroomDecks)
                .HasForeignKey(cu => cu.DeckId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Property(cu => cu.AddedAt)
                .IsRequired();
        }
    }
}