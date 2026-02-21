using noava.DTOs.Statistics;
using noava.Mappers.Statistics;
using noava.Repositories.Statistics;

namespace noava.Services.Statistics.Decks
{
    public class DeckStatsService : IDeckStatsService
    {
        private readonly IStatisticsRepository _statisticsRepository;

        public DeckStatsService(IStatisticsRepository repository)
        {
            _statisticsRepository = repository;
        }

        public async Task<DeckStatisticsResponse?> GetDeckStatsAsync(int deckId, string userId)
        {
            var deckUserStatistics = await _statisticsRepository.GetByDeckAndUserAsync(deckId, userId);

            if (deckUserStatistics == null)
                return null;

            var deckStatisticsResponse = deckUserStatistics.ToResponseDto();

            return deckStatisticsResponse;
        }
    }
}