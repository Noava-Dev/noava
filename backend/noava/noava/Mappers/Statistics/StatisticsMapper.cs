using noava.DTOs.Statistics;
using noava.Models.AggregateStatistics;

namespace noava.Mappers.Statistics
{
    public static class StatisticsMapper
    {
        public static DeckStatisticsResponse ToResponseDto(this DeckUserStatistics entity)
        {

            return new DeckStatisticsResponse
            {
                DeckId = entity.DeckId,
                CardsReviewed = entity.CardsReviewed,
                CorrectCards = entity.CorrectCards,
                AccuracyRate = entity.AccuracyRate,
                TimeSpentSeconds = entity.TimeSpentSeconds,
                AvgResponseTimeMs = entity.AvgResponseTimeMs,
                LastReviewedAt = entity.LastReviewedAt,
                AvgMasteryLevel = entity.AvgMasteryLevel
            };
        }

        public static IEnumerable<DeckStatisticsResponse> ToResponseDtos(this IEnumerable<DeckUserStatistics> entities)
        {
            return entities.Select(e => e.ToResponseDto());
        }
    }
}