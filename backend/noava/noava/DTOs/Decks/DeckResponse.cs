using noava.Models;
using noava.Models.Enums;

namespace noava.DTOs.Decks
{
    public class DeckResponse
    {
        public int DeckId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Language { get; set; } = string.Empty;
        public DeckVisibility Visibility { get; set; }
        public string JoinCode { get; set; }
        public string? CoverImageBlobName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<DeckClassroomInfoDto> Classrooms { get; set; } = [];
    }
}