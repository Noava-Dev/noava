namespace noava.Data.Configurations
{

    //public class DeckConfiguration : IEntityTypeConfiguration<Deck>
    //{
    //    public void Configure(EntityTypeBuilder<Deck> builder)
    //    {
    //        builder.ToTable("Decks");             // table name
    //        builder.HasKey(d => d.Id);            // primary key

    //        builder.Property(d => d.Name)
    //               .IsRequired()
    //               .HasMaxLength(100);

    //        builder.HasMany(d => d.Cards)         // relationship
    //               .WithOne(c => c.Deck)
    //               .HasForeignKey(c => c.DeckId);
    //    }
    //}
}
