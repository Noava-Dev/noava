using noava.DTOs.Statistics;

namespace noava.Services.Statistics.Decks
{
    public interface IDeckStatsService
    {
        Task<DeckStatisticsResponse?> GetDeckStatsAsync(int deckId, string userId);
    }
}