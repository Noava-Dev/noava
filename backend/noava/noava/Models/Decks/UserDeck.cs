using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace noava.Models
{
    [Table("Users_Decks")]
    public class UserDeck
    {

        [Required]
        [Column("ClerkId")]
        public string ClerkId { get; set; } = string.Empty;

        [Required]
        [Column("DeckId")]
        public int DeckId { get; set; }

        [Required]
        [Column("IsOwner")]
        public bool IsOwner { get; set; } = false;  

        [Column("AddedAt")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ClerkId")]
        public virtual User? User { get; set; }

        [ForeignKey("DeckId")]
        public virtual Deck? Deck { get; set; }
    }
}