using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Models.AggregateStatistics;
using noava.Repositories.Classrooms;
using noava.Services;

namespace noava.Shared
{
    public class AggregateStatisticsService : IAggregateStatisticsService
    {
        private readonly NoavaDbContext _dbContext;
        private readonly IClassroomRepository _classroomRepository;
        private readonly ILeitnerBoxService _leitnerBoxService;

        public AggregateStatisticsService(NoavaDbContext dbContext, IClassroomRepository classroomRepository, ILeitnerBoxService leitnerBoxService) 
        {
            _dbContext = dbContext;
            _classroomRepository = classroomRepository;
            _leitnerBoxService = leitnerBoxService;
        }

        // stat updates based on card interactions
        public async Task UpdateInteractionStatsAsync(IEnumerable<CardInteraction> interactions, CancellationToken ct = default)
        {
            if (!interactions.Any()) return;

            using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);

            try
            {

                // deck-user
                await UpdateDeckUserInteractionStatisticsAsync(interactions, ct);


                // classrooms
                var classroomGroups = interactions.GroupBy(i => new { i.ClerkId, i.DeckId });
                var classroomLookup = new Dictionary<(string ClerkId, int DeckId), List<int>>();
                foreach (var group in classroomGroups)
                {
                    var pair = group.Key;
                    var classroomIds = await _classroomRepository.GetClassroomIdsForDeckAndUser(pair.DeckId, pair.ClerkId);

                    classroomLookup[(pair.ClerkId, pair.DeckId)] = classroomIds;
                }

                await UpdateClassroomInteractionStatisticsAsync(interactions, classroomLookup, ct);
            }
            catch (OperationCanceledException)
            {
                // don't know what to do yet, also this isn't properly implemented yet so this will likely never throw
                return;
            }

            await transaction.CommitAsync(ct);
        }

        // stat updates based on study sessions
        public async Task UpdateStudySessionStatsAsync(StudySession session, CancellationToken ct = default)
        {
            if (session == null) 
                return;

            using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);

            try
            {
                // deck-user
                await UpdateDeckUserStudySessionStatisticsAsync(session, ct);

                // classrooms
                var classroomIds = await _classroomRepository.GetClassroomIdsForDeckAndUser(session.DeckId, session.ClerkId);
                if (!classroomIds.Any())
                    return;

                await UpdateClassroomStudySessionStatisticsAsync(session, classroomIds, ct);
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

        public Task RecomputeAllStatisticsAsync(CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        private async Task UpdateDeckUserInteractionStatisticsAsync(IEnumerable<CardInteraction> interactions, CancellationToken ct = default)
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

        private async Task UpdateClassroomInteractionStatisticsAsync(
            IEnumerable<CardInteraction> interactions, 
            Dictionary<(string ClerkId, int DeckId), List<int>> classroomLookup, 
            CancellationToken ct = default
        ) 
        {
            var classroomInteractions = new Dictionary<int, List<CardInteraction>>();

            foreach (var interaction in interactions)
            {
                // find classrooms for this interaction
                if (!classroomLookup.TryGetValue((interaction.ClerkId, interaction.DeckId), out var classroomIds))
                    continue;

                // loop over each classroom the cardinteraction belongs to and add it to the list of interactions for that classroom
                foreach (var classroomId in classroomIds)
                {
                    if (!classroomInteractions.TryGetValue(classroomId, out var list))
                    {
                        list = new List<CardInteraction>();
                        classroomInteractions[classroomId] = list;
                    }
                    
                    list.Add(interaction);
                }
            }

            foreach (var kvp in classroomInteractions)
            {
                var classroomId = kvp.Key;
                var interactionsForClassroom = kvp.Value;

                // fetch existing stats or create new
                var stat = await _dbContext.ClassroomStatistics
                    .Include(s => s.ActiveUsers)
                    .FirstOrDefaultAsync(s => s.ClassroomId == classroomId, ct)
                    ?? new ClassroomStatistics
                    {
                        ClassroomId = classroomId
                    };

                stat.CardsReviewed += interactionsForClassroom.Count();
                stat.CorrectCards += interactionsForClassroom.Count(i => i.IsCorrect);

                var totalMastery = interactionsForClassroom.Sum(i => _leitnerBoxService.GetBoxFromInterval(i.IntervalAfter));
                stat.AvgMasteryLevel = (double)(stat.AvgMasteryLevel * (stat.CardsReviewed - interactionsForClassroom.Count()) + totalMastery) / stat.CardsReviewed;

                foreach (var interaction in interactionsForClassroom)
                {
                    if (!stat.ActiveUsers.Any(u => u.ClerkId == interaction.ClerkId))
                    {
                        var user = await _dbContext.Users.FindAsync(interaction.ClerkId, ct);
                        if (user != null)
                        {
                            stat.ActiveUsers.Add(user);
                        }
                    }
                }

                if (_dbContext.Entry(stat).State == EntityState.Detached)
                {
                    _dbContext.ClassroomStatistics.Add(stat);
                }
            }

            ct.ThrowIfCancellationRequested();
            await _dbContext.SaveChangesAsync(ct);
        }

        private async Task UpdateDeckUserStudySessionStatisticsAsync(StudySession session, CancellationToken ct = default)
        {
            var stat = await _dbContext.DeckUserStatistics
                .FirstOrDefaultAsync(s => s.DeckId == session.DeckId && s.ClerkId == session.ClerkId, ct);

            if (stat != null)
            {
                stat.TimeSpentSeconds += (int)(session.EndTime - session.StartTime).TotalSeconds;
            }

            ct.ThrowIfCancellationRequested();
            await _dbContext.SaveChangesAsync(ct);
        }

        private async Task UpdateClassroomStudySessionStatisticsAsync(StudySession session, List<int> classroomIds, CancellationToken ct = default)
        {
            foreach (var classroomId in classroomIds)
            {
                var stat = await _dbContext.ClassroomStatistics
                    .FirstOrDefaultAsync(s => s.ClassroomId == classroomId, ct);

                if (stat != null)
                {
                    stat.TimeSpentSeconds += (int)(session.EndTime - session.StartTime).TotalSeconds;
                }
            }
            ct.ThrowIfCancellationRequested();
            await _dbContext.SaveChangesAsync(ct);
        }
    }
}