using noava.DTOs.Statistics;

namespace noava.Services.Statistics.Decks
{
    public interface IDeckStatsService
    {
        Task<DeckStatisticsResponse?> GetDeckStatsAsync(int deckId, string userId);
        Task<DeckStatisticsResponse?> GetDeckStatsForTeacherAsync(IEnumerable<int> deckIds, string userId, string teacherId, int classroomId);
    }
}