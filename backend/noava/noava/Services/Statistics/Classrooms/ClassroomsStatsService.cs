using noava.DTOs.Statistics;
using noava.Mappers.Statistics;
using noava.Repositories.Statistics;

namespace noava.Services.Statistics.Classrooms
{
    public class ClassroomsStatsService : IClassroomsStatsService
    {
        private readonly IStatisticsRepository _statisticsRepository;

        public ClassroomsStatsService(IStatisticsRepository repository)
        {
            _statisticsRepository = repository;
        }

        public async Task<ClassroomStatisticsResponse?> GetClassroomStatsAsync(int classroomId)
        {
            var classroomStatistics = await _statisticsRepository.GetByClassroomIdAsync(classroomId);

            if (classroomStatistics == null)
                return null;

            var classroomStatisticsResponse = classroomStatistics.ToResponseDto();

            return classroomStatisticsResponse;
        }
    }
}
