namespace noava.DTOs.Cards.Interactions
{
    public class CardInteractionIntervalRequest
    {
        public int IntervalBefore { get; set; }
        public int IntervalAfter { get; set; }
        public DateTime DueAtBefore { get; set; }
        public DateTime DueAtAfter { get; set; }
    }
}