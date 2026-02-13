namespace noava.DTOs.Schools
{
    public class SchoolClassroomResponseDto
    {
        public int ClassroomId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StudentCount { get; set; }
        public int DeckCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}