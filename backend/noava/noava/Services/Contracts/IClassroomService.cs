using noava.DTOs.Request.Classrooms;
using noava.DTOs.Response.Classrooms;
using noava.DTOs.Response.Users;
using noava.Models;

namespace noava.Services.Contracts
{
    public interface IClassroomService
    {
        Task<ClassroomResponseDto> CreateAsync(ClassroomRequestDto classroom, string userId);
        Task<IEnumerable<ClassroomResponseDto>> GetAllByUserAsync(string userId);
        Task<ClassroomResponseDto?> GetByIdAsync(int id, string userId);
        Task<ClassroomResponseDto?> GetByJoinCodeAsync(string joinCode, string userId);
        Task<ClassroomResponseDto?> JoinByClassroomCode(string joinCode, string userId);
        Task<ClassroomResponseDto?> UpdateJoinCode(int id, string userId);
        Task<ClassroomResponseDto> UpdateAsync(int id, ClassroomRequestDto classroom, string userId);
        Task<ClassroomResponseDto> RemoveUserAsync(int classroomId, string targetUserId, string userId);
        Task<ClassroomResponseDto> SetUserTeacherStatusAsync(int classroomId, string targetUserId, string userId, bool isTeacher);
        Task<ClassroomResponseDto> DeleteAsync(int id, string userId);
        Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersByClassroomAsync(int classroomId, int page, int pageSize);
        Task<ClassroomResponseDto> InviteUserByEmail(int classroomId, string userId, string email);
    }
}