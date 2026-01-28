using noava.Models;
using noava.Temp.DTOs.request;
using noava.Temp.DTOs.response;

namespace noava.Services.Contracts
{
    public interface IClassroomService
    {
        Task<ClassroomResponseDto> CreateAsync(ClassroomRequestDto classroom, string userId);
        Task<IEnumerable<ClassroomResponseDto>> GetAllByUserAsync(string userId);
        Task<ClassroomResponseDto?> GetByIdAsync(int id, string userId);
        Task<ClassroomResponseDto?> GetByJoinCodeAsync(string joinCode);
        Task<ClassroomResponseDto?> JoinByClassroomCode(string joinCode, string userId);
    }
}