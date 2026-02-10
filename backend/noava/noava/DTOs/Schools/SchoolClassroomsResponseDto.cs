namespace noava.DTOs.Schools
{
    public class SchoolClassroomResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StudentCount { get; set; }

        //TODO: make sure the logic for this is setup in decks and classrooms
        public int DeckCount { get; set; }
    }
}