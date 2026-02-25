using noava.Models;

namespace noava.Shared
{
    public interface IAggregateStatisticsService
    {
        Task RecomputeAllStatisticsAsync(CancellationToken ct = default);
        Task RecomputeDeckUserStatisticsAsync(CancellationToken ct = default);
        Task UpdateInteractionStatsAsync(IEnumerable<CardInteraction> interactions, CancellationToken ct = default);
        Task UpdateStudySessionStatsAsync(StudySession session, CancellationToken ct = default);
    }
}