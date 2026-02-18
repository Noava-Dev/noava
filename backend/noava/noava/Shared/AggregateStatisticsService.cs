using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Models.AggregateStatistics;
using noava.Services;

namespace noava.Shared
{
    public class AggregateStatisticsService : IAggregateStatisticsService
    {
        private readonly NoavaDbContext _dbContext;
        private readonly ILeitnerBoxService _leitnerBoxService;

        public AggregateStatisticsService(NoavaDbContext dbContext, ILeitnerBoxService leitnerBoxService) 
        {
            _dbContext = dbContext;
            _leitnerBoxService = leitnerBoxService;
        }

        public async Task UpdateStatsAsync(IEnumerable<CardInteraction> interactions, StudySession? session = null, CancellationToken ct = default)
        {
            if (!interactions.Any()) return;

            using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);

            try
            {
                await UpdateDeckUserStatisticsAsync(interactions, session, ct);
                await UpdateClassroomUserStatisticsAsync(interactions, session, ct);
                await UpdateClassroomDeckStatisticsAsync(interactions, session, ct);
            }
            catch (OperationCanceledException)
            {
                // don't know what to do yet, also this isn't properly implemented yet so this will likely never throw
                return;
            }


            await transaction.CommitAsync(ct);
        }

        // Full recomputation methods - these would be called periodically to ensure stats are accurate, especially if we change the way stats are calculated
        public Task RecomputeDeckUserStatisticsAsync(CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        public Task RecomputeClassroomUserStatisticsAsync(CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        public Task RecomputeClassroomDeckStatisticsAsync(CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        public Task RecomputeAllStatisticsAsync(CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        private async Task UpdateDeckUserStatisticsAsync(IEnumerable<CardInteraction> interactions, StudySession? session, CancellationToken ct = default)
        {
            var groups = interactions.GroupBy(i => new { i.ClerkId, i.DeckId });

            if (!groups.Any()) return;

            foreach (var group in groups)
            {
                ct.ThrowIfCancellationRequested();

                var stat = await _dbContext.DeckUserStatistics
                    .FirstOrDefaultAsync(s => s.DeckId == group.Key.DeckId && s.ClerkId == group.Key.ClerkId, ct)
                    ?? new DeckUserStatistics
                    {
                        DeckId = group.Key.DeckId,
                        ClerkId = group.Key.ClerkId
                    };



                stat.CardsReviewed += group.Count();

                stat.CorrectCards += group.Count(i => i.IsCorrect);

                if (session != null && session.ClerkId == group.Key.ClerkId && session.DeckId == group.Key.DeckId)
                {
                    stat.TimeSpentSeconds += (int)(session.EndTime - session.StartTime).TotalSeconds;
                }

                stat.AvgResponseTimeMs = (int)((stat.AvgResponseTimeMs * (stat.CardsReviewed - group.Count()) + group.Sum(i => i.ResponseTimeMs)) / stat.CardsReviewed);

                stat.AccuracyRate = (double)stat.CorrectCards / stat.CardsReviewed;

                var totalMastery = group.Sum(i => _leitnerBoxService.GetBoxFromInterval(i.IntervalAfter));
                stat.AvgMasteryLevel = (double)(stat.AvgMasteryLevel * (stat.CardsReviewed - group.Count()) + totalMastery) / stat.CardsReviewed;

                stat.LastReviewedAt = group.Max(i => i.Timestamp);

                if (_dbContext.Entry(stat).State == EntityState.Detached)
                {
                    _dbContext.DeckUserStatistics.Add(stat);
                }
            }

            ct.ThrowIfCancellationRequested();
            await _dbContext.SaveChangesAsync(ct);
        }

        private async Task UpdateClassroomUserStatisticsAsync(IEnumerable<CardInteraction> interactions, StudySession? session, CancellationToken ct = default)
        {

        }

        private async Task UpdateClassroomDeckStatisticsAsync(IEnumerable<CardInteraction> interactions, StudySession? session, CancellationToken ct = default)
        {

        }
    }
}
