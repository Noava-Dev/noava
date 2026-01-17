using Microsoft.EntityFrameworkCore;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // automatically applies all IEntityTypeConfiguration<T> in this assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(NoavaDbContext).Assembly);
        }
    }
}
