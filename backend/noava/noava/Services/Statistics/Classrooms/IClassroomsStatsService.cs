using noava.DTOs.Statistics;

namespace noava.Services.Statistics.Classrooms
{
    public interface IClassroomsStatsService
    {
        Task<ClassroomStatisticsResponse?> GetClassroomStatsAsync(int classroomId);
    }
}