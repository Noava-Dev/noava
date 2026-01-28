namespace noava.DTOs.Request
{
    public class CardRequest
    {
        public string FrontText { get; set; } = string.Empty;
        public string BackText { get; set; } = string.Empty;
        public string? FrontImage { get; set; }
        public string? FrontAudio { get; set; }
        public string? BackImage { get; set; }
        public string? BackAudio { get; set; }
        public string? Memo { get; set; }
    }
}