namespace noava.DTOs.Response
{
    public class DeckOwnerResponse
    {
        public string ClerkId { get; set; } = string.Empty;
        public int DeckId { get; set; }
        public bool IsOwner { get; set; }
        public DateTime AddedAt { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string? UserName { get; set; }
    }
}