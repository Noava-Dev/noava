using noava.DTOs.Statistics;
using noava.Repositories.Statistics;

namespace noava.Services.Statistics.General
{
    public class StatsService : IStatsService
    {
        public readonly IStatisticsRepository _statisticsRepository;
        public StatsService(IStatisticsRepository statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
        }
        public async Task<DashboardStatisticsResponse?> GetGeneralStatsAsync(string userId)
        {
            var statsList = await _statisticsRepository.GetGeneralStatsAsync(userId);

            if (statsList == null || statsList.Count == 0)
            {
                return new DashboardStatisticsResponse
                {
                    AccuracyRate = 0,
                    CardsReviewed = 0,
                    LastRevieweDate = null,
                    TimeSpentHours = 0
                };
            }

            int totalCardsReviewed = statsList.Sum(s => s.CardsReviewed);
            int totalCorrectCards = statsList.Sum(s => s.CorrectCards);

            double accuracyRate = totalCardsReviewed == 0
                ? 0
                : (double)totalCorrectCards / totalCardsReviewed * 100;

            DateTime lastReviewedAt = statsList.Max(s => s.LastReviewedAt);

            double totalTimeHours = statsList.Sum(s => s.TimeSpentSeconds) / 3600.0;

            return new DashboardStatisticsResponse
            {
                CardsReviewed = totalCardsReviewed,
                AccuracyRate = accuracyRate,
                LastRevieweDate = lastReviewedAt,
                TimeSpentHours = (int) totalTimeHours
            };
        }
    }
}