using noava.DTOs.Statistics;

namespace noava.Services.Statistics.General
{
    public interface IStatsService
    {
        Task<DashboardStatisticsResponse?> GetGeneralStatsAsync(string userId);
    }
}