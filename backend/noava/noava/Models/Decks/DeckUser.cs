using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace noava.Models
{
    [Table("Deck_Users")]
    public class DeckUser
    {
        [Required]
        [Column("ClerkId")]
        public string ClerkId { get; set; }

        [Required]
        [Column("DeckId")]
        public int DeckId { get; set; }

        [Required]
        [Column("IsOwner")]
        public bool IsOwner { get; set; }

        [Column("AddedAt")]
        public DateTime AddedAt { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Deck? Deck { get; set; }
    }
}