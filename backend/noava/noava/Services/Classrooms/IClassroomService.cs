using noava.DTOs.Classrooms;
using noava.DTOs.Clerk;
using noava.DTOs.Decks;
using noava.Models;

namespace noava.Services.Classrooms
{
    public interface IClassroomService
    {
        Task<ClassroomResponseDto> CreateAsync(ClassroomRequestDto classroom, string userId);
        Task<IEnumerable<ClassroomResponseDto>> GetAllByUserAsync(string userId, int? take);
        Task<ClassroomResponseDto?> GetByIdAsync(int id, string userId);
        Task<ClassroomResponseDto?> GetByJoinCodeAsync(string joinCode, string userId);
        Task<ClassroomResponseDto?> JoinByClassroomCode(string joinCode, string userId);
        Task<ClassroomResponseDto?> UpdateJoinCode(int id, string userId);
        Task<ClassroomResponseDto> UpdateAsync(int id, ClassroomRequestDto classroom, string userId);
        Task<ClassroomResponseDto> RemoveUserAsync(int classroomId, string targetUserId, string userId);
        Task<ClassroomResponseDto> SetUserTeacherStatusAsync(int classroomId, string targetUserId, string userId, bool isTeacher);
        Task<ClassroomResponseDto> DeleteAsync(int id, string userId);
        Task<IEnumerable<ClassroomUserResponseDto>> GetAllUsersByClassroomAsync(int classroomId, int page, int pageSize);
        Task<ClassroomResponseDto> InviteUserByEmail(int classroomId, string userId, string email);
        Task<ClassroomResponseDto> AddDeckAsync(int classroomId, int deckId, string userId);
        Task<ClassroomResponseDto> RemoveDeckAsync(int classroomId, int deckId, string userId);
        Task<List<DeckResponse>> GetDecksForClassroomAsync(int classroomId, string userId);
    }
}