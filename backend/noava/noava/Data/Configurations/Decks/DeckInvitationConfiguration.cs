using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class DeckInvitationConfiguration : IEntityTypeConfiguration<DeckInvitation>
    {
        public void Configure(EntityTypeBuilder<DeckInvitation> builder)
        {
            builder.ToTable("DeckInvitations");

            builder.HasKey(i => i.InvitationId);

            builder.Property(i => i.InvitedByClerkId)
                .IsRequired();

            builder.Property(i => i.InvitedUserEmail)
                .IsRequired();

            builder.Property(i => i.InvitedUserClerkId);

            builder.Property(i => i.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(i => i.InvitedAt)
                .IsRequired();

            builder.HasOne(i => i.Deck)
                .WithMany()
                .HasForeignKey(i => i.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(i => i.InvitedBy)
                .WithMany()
                .HasForeignKey(i => i.InvitedByClerkId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(i => i.InvitedUser)
                .WithMany()
                .HasForeignKey(i => i.InvitedUserClerkId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(i => i.InvitedUserEmail);
            builder.HasIndex(i => i.InvitedUserClerkId);
            builder.HasIndex(i => i.Status);
        }
    }
}