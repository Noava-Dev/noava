using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class UserDeckConfiguration : IEntityTypeConfiguration<UserDeck>
    {
        public void Configure(EntityTypeBuilder<UserDeck> builder)
        {
            builder.ToTable("Users_Decks");

            builder.HasKey(ud => new { ud.ClerkId, ud.DeckId });

            builder.Property(ud => ud.ClerkId)
                .IsRequired()
                .HasMaxLength(450);

            builder.Property(ud => ud.DeckId)
                .IsRequired();

            builder.Property(ud => ud.IsOwner)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(ud => ud.AddedAt)
                .IsRequired();

            builder.HasOne(ud => ud.User)
                .WithMany()
                .HasForeignKey(ud => ud.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ud => ud.Deck)
                .WithMany()
                .HasForeignKey(ud => ud.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(ud => ud.ClerkId);
            builder.HasIndex(ud => ud.DeckId);
        }
    }
}