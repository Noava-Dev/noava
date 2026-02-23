using noava.DTOs.Statistics;
using noava.Models.AggregateStatistics;

namespace noava.Repositories.Statistics
{
    public interface IStatisticsRepository
    {
        Task<DeckUserStatistics?> GetByDeckAndUserAsync(int deckId, string userId);
        Task<List<DeckUserStatistics>> GetGeneralStatsAsync(string userId);
        Task<ClassroomStatistics?> GetByClassroomIdAsync(int classroomId);
    }
}