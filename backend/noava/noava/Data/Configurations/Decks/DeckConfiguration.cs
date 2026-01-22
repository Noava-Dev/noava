using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class DeckConfiguration : IEntityTypeConfiguration<Deck>
    {
        public void Configure(EntityTypeBuilder<Deck> builder)
        {
            builder.HasKey(d => d.DeckId);
            builder.HasKey(d => d.DeckId);

            builder.Property(d => d.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(d => d.Description)
                .HasMaxLength(1000);

            builder.Property(d => d.Language)
                .HasMaxLength(50);

            builder.Property(d => d.Visibility)
                .HasConversion<int>();

            builder.Property(d => d.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(d => d.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");



            // Seed data
            builder.HasData(
                new Deck
                {
                    DeckId = 1,
                    Title = "Frans Woordenschat",
                    Description = "Franse woorden voor beginners",
                    Language = "Frans",
                    Visibility = DeckVisibility.Public,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Deck
                {
                    DeckId = 2,
                    Title = "Engels Grammatica",
                    Description = "Engelse grammatica oefeningen",
                    Language = "Engels",
                    Visibility = DeckVisibility.Private,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Deck
                {
                    DeckId = 3,
                    Title = "Spaans Conversatie",
                    Description = "Spaanse zinnen voor dagelijks gebruik",
                    Language = "Spaans",
                    Visibility = DeckVisibility.Shared,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
