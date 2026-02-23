using noava.DTOs.Statistics;
using noava.Mappers.Statistics;
using noava.Repositories.Classrooms;
using noava.Repositories.Statistics;

namespace noava.Services.Statistics.Decks
{
    public class DeckStatsService : IDeckStatsService
    {
        private readonly IStatisticsRepository _statisticsRepository;
        private readonly IClassroomDeckRepository _classroomDeckRepository;
        private readonly IClassroomRepository _classroomRepository;

        public DeckStatsService(IStatisticsRepository repository, IClassroomDeckRepository classroomDeckRepository, IClassroomRepository classroomRepository)
        {
            _statisticsRepository = repository;
            _classroomDeckRepository = classroomDeckRepository;
            _classroomRepository = classroomRepository;
        }

        public async Task<DeckStatisticsResponse?> GetDeckStatsAsync(int deckId, string userId)
        {
            var deckUserStatistics = await _statisticsRepository.GetByDeckAndUserAsync(deckId, userId);

            if (deckUserStatistics == null)
                return null;

            var deckStatisticsResponse = deckUserStatistics.ToResponseDto();

            return deckStatisticsResponse;
        }

        public async Task<DeckStatisticsResponse?> GetDeckStatsForTeacherAsync(IEnumerable<int> deckIds, string userId, string teacherId, int classroomId)
        {
            var doDecksBelongToClassroom = await _classroomDeckRepository.ExistsAsync(deckIds, classroomId);

            if (!doDecksBelongToClassroom)
                return null;

            var isTeacherOfClassroom = await _classroomRepository.IsTeacherOfClassroomAsync(classroomId, teacherId);

            if (!isTeacherOfClassroom)
                return null;

            var stats = await _statisticsRepository.GetByDecksAndUserAsync(deckIds, userId);
            if (stats == null || stats.Count == 0)
                return new DeckStatisticsResponse();

            var totalCardsReviewed = stats.Sum(s => s.CardsReviewed);
            var totalCorrectCards = stats.Sum(s => s.CorrectCards);
            var totalTimeSpent = stats.Sum(s => s.TimeSpentSeconds);

            var weightedAvgResponseTime = totalCardsReviewed == 0
                ? 0
                : stats.Sum(s => s.AvgResponseTimeMs * s.CardsReviewed) / totalCardsReviewed;

            var avgMastery = stats.Average(s => s.AvgMasteryLevel);

            var lastReviewed = stats.Max(s => s.LastReviewedAt);

            return new DeckStatisticsResponse
            {
                CardsReviewed = totalCardsReviewed,
                CorrectCards = totalCorrectCards,
                TimeSpentSeconds = totalTimeSpent,
                AvgResponseTimeMs = weightedAvgResponseTime,
                AvgMasteryLevel = avgMastery,
                LastReviewedAt = lastReviewed
            };
        }
    }
}