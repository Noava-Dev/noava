using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class DeckUserConfiguration : IEntityTypeConfiguration<DeckUser>
    {
        public void Configure(EntityTypeBuilder<DeckUser> builder)
        {
            builder.ToTable("Decks_Users");

            builder.HasKey(ud => new { ud.ClerkId, ud.DeckId });

            builder.Property(du => du.ClerkId)
                   .IsRequired()
                   .HasColumnName("ClerkId");

            builder.Property(ud => ud.DeckId)
                .IsRequired()
                .HasColumnName("DeckId");

            builder.Property(ud => ud.IsOwner)
                .IsRequired()
                .HasColumnName("IsOwner")
                .HasDefaultValue(false);

            builder.Property(ud => ud.AddedAt)
                .IsRequired();

            builder.HasOne(du => du.User)
                .WithMany()
                .HasForeignKey(du => du.ClerkId)  
                .HasPrincipalKey(u => u.ClerkId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(du => du.Deck)
                .WithMany(d => d.DeckUsers)
                .HasForeignKey(du => du.DeckId) 
                .HasPrincipalKey(d => d.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(ud => ud.ClerkId);
            builder.HasIndex(ud => ud.DeckId);
        }
    }
}