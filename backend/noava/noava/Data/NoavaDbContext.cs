using Microsoft.EntityFrameworkCore;
using noava.Data.Configurations;
using noava.Models;

namespace noava.Data
{
    public class NoavaDbContext : DbContext
    {
        public NoavaDbContext(DbContextOptions<NoavaDbContext> options)
        : base(options)
        {
        }

        public DbSet<Deck> Decks { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<FAQ> FAQs { get; set;  }
        public DbSet<User> Users { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<CardProgress> CardProgress { get; set; }
        public DbSet<CardInteractions> CardInteractions { get; set; }
        public DbSet<StudySessions> StudySessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // automatically applies all IEntityTypeConfiguration<T> in this assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(NoavaDbContext).Assembly);
        }
    }
}
