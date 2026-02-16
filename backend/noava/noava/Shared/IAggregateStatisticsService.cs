using noava.Models;

namespace noava.Shared
{
    public interface IAggregateStatisticsService
    {
        Task RecomputeAllStatisticsAsync(CancellationToken ct = default);
        Task RecomputeClassroomDeckStatisticsAsync(CancellationToken ct = default);
        Task RecomputeClassroomUserStatisticsAsync(CancellationToken ct = default);
        Task RecomputeDeckUserStatisticsAsync(CancellationToken ct = default);
        Task UpdateStatsAsync(IEnumerable<CardInteractions> interactions, StudySessions? session, CancellationToken ct = default);
    }
}