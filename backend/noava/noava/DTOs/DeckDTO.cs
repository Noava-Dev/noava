using noava.Models.Enums;

namespace noava.DTOs
{
    public class CreateDeckRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Language { get; set; } = string.Empty;
        public DeckVisibility Visibility { get; set; }
        public string? CoverImageBlobName { get; set; }

    }

    public class UpdateDeckRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Language { get; set; } = string.Empty;
        public DeckVisibility Visibility { get; set; }
        public string? CoverImageBlobName { get; set; }
    }
}