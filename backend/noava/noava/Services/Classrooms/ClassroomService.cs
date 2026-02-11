using noava.DTOs.Classrooms;
using noava.DTOs.Clerk;
using noava.DTOs.Decks;
using noava.DTOs.Notifications;
using noava.Mappers.Classrooms;
using noava.Mappers.Decks;
using noava.Models;
using noava.Models.Enums;
using noava.Repositories.Classrooms;
using noava.Services.Notifications;
using noava.Shared;
using System.Security.Cryptography;
using System.Text.Json;

namespace noava.Services.Classrooms
{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;
        private readonly IClerkService _clerkService;
        private readonly INotificationService _notificationService;


        public ClassroomService(
            IClassroomRepository classroomRepository,
            IClerkService clerkService,
            INotificationService notificationService)
        {
            _classroomRepository = classroomRepository;
            _clerkService = clerkService;
            _notificationService = notificationService;
        }

        public async Task<ClassroomResponseDto> CreateAsync(ClassroomRequestDto classroomDto, string userId)
        {
            var classroom = classroomDto.ToEntity();
            classroom.JoinCode = GenerateClassroomCode();

            classroom.ClassroomUsers.Add(new ClassroomUser
            {
                UserId = userId,
                IsTeacher = true
            });

            await _classroomRepository.AddAsync(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<IEnumerable<ClassroomResponseDto>> GetAllByUserAsync(string userId)
        {
            var classrooms = await _classroomRepository.GetAllByUserAsync(userId);
            return classrooms.ToResponseDtos(userId);
        }

        public async Task<ClassroomResponseDto?> GetByIdAsync(int id, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(id);

            if (classroom == null)
                return null;

            var isMember = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId);

            if (!isMember)
                return null;

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto?> GetByJoinCodeAsync(string joinCode, string userId)
        {
            var classroom = await _classroomRepository.GetByJoinCodeAsync(joinCode);
            return classroom?.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto?> JoinByClassroomCode(string joinCode, string userId)
        {
            var classroom = await _classroomRepository.GetByJoinCodeAsync(joinCode);

            if (classroom == null)
                return null;

            var alreadyMember = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId);

            if (!alreadyMember)
            {
                classroom.ClassroomUsers.Add(new ClassroomUser
                {
                    UserId = userId,
                    IsTeacher = false
                });

                await _classroomRepository.SaveChangesAsync();
            }

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> UpdateAsync(int id,ClassroomRequestDto classroomDto,string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(id);

            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can update a classroom.");

            classroom.Name = classroomDto.Name;
            classroom.Description = classroomDto.Description;

            await _classroomRepository.UpdateAsync(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> RemoveUserAsync(int classroomId, string targetUserId, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId);
            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher) 
                throw new UnauthorizedAccessException("Only teachers can remove users.");

            var targetUser = classroom.ClassroomUsers
                .FirstOrDefault(cu => cu.UserId == targetUserId);

            if (targetUser == null)
                throw new KeyNotFoundException("Target user not found in the classroom.");

            classroom.ClassroomUsers.Remove(targetUser);

            await _classroomRepository.UpdateAsync(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> SetUserTeacherStatusAsync(int classroomId, string targetUserId, string userId, bool isTeacher)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId);
            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var requesterIsTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!requesterIsTeacher)
                throw new UnauthorizedAccessException("Only teachers can change roles.");

            var targetUser = classroom.ClassroomUsers
                .FirstOrDefault(cu => cu.UserId == targetUserId);

            if (targetUser == null)
                throw new KeyNotFoundException("Target user not found in the classroom.");

            targetUser.IsTeacher = isTeacher;

            await _classroomRepository.UpdateAsync(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> DeleteAsync(int id, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(id);

            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can delete a classroom.");

            _classroomRepository.Delete(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto?> UpdateJoinCode(int id, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(id);

            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can update the join code.");

            classroom.JoinCode = GenerateClassroomCode();

            await _classroomRepository.UpdateAsync(classroom);
            await _classroomRepository.SaveChangesAsync();

            return classroom.ToResponseDto(userId);
        }

        public async Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersByClassroomAsync(
            int classroomId, int page, int pageSize)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId);
            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var userIds = classroom.ClassroomUsers
                .Select(cu => cu.UserId)
                .Distinct()
                .ToList();

            if (!userIds.Any())
                return Enumerable.Empty<ClerkUserResponseDto>();

            var pagedUserIds = userIds
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var clerkUsers = await _clerkService.GetUsersAsync(pagedUserIds);

            var teacherLookup = classroom.ClassroomUsers
                .Where(cu => cu.IsTeacher)
                .ToDictionary(cu => cu.UserId, cu => true);

            foreach (var user in clerkUsers)
            {
                user.IsTeacher = teacherLookup.ContainsKey(user.ClerkId);
            }

            return clerkUsers;
        }
        public async Task<ClassroomResponseDto> InviteUserByEmail(int classroomId,string userId,string email)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId)
                ?? throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can invite users.");

            var invitedUser = await _clerkService.GetUserByEmailAsync(email)
                ?? throw new KeyNotFoundException("User with this email not found.");

            var teacher = await _clerkService.GetUserAsync(userId)
                ?? throw new KeyNotFoundException("Inviting teacher not found.");

            var teacherFullName = $"{teacher.FirstName} {teacher.LastName}".Trim();

            var parametersJson = JsonSerializer.Serialize(new
            {
                classroomName = classroom.Name,
                teacherName = teacherFullName
            });

            var notification = new NotificationRequestDto
            {
                Type = NotificationType.ClassroomInvitationReceived,
                TemplateKey = "notifications.items.classroom.invite.received",
                UserId = invitedUser.ClerkId,
                ParametersJson = parametersJson,
                Actions = new List<NotificationActionRequestDto>
                {
                    new NotificationActionRequestDto
                    {
                        LabelKey = "notifications.items.classroom.invite.actions.accept",
                        Endpoint = $"/classrooms/join/{classroom.JoinCode}",
                        Method = HttpMethodType.POST
                    }
                }
            };

            await _notificationService.CreateNotificationAsync(notification);

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> AddDeckAsync(int classroomId, int deckId, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId)
                ?? throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can add decks.");

            var alreadyLinked = classroom.ClassroomDecks
                .Any(cd => cd.DeckId == deckId);

            if (!alreadyLinked)
            {
                classroom.ClassroomDecks.Add(new ClassroomDeck
                {
                    DeckId = deckId,
                    ClassroomId = classroomId,
                    AddedAt = DateTime.UtcNow
                });

                await _classroomRepository.UpdateAsync(classroom);
                await _classroomRepository.SaveChangesAsync();
            }

            return classroom.ToResponseDto(userId);
        }

        public async Task<ClassroomResponseDto> RemoveDeckAsync(int classroomId, int deckId, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId)
                ?? throw new KeyNotFoundException("Classroom not found.");

            var isTeacher = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            if (!isTeacher)
                throw new UnauthorizedAccessException("Only teachers can remove decks.");

            var link = classroom.ClassroomDecks
                .FirstOrDefault(cd => cd.DeckId == deckId);

            if (link != null)
            {
                classroom.ClassroomDecks.Remove(link);

                await _classroomRepository.UpdateAsync(classroom);
                await _classroomRepository.SaveChangesAsync();
            }

            return classroom.ToResponseDto(userId);
        }

        public async Task<List<DeckResponse>> GetDecksForClassroomAsync(int classroomId, string userId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId);

            if (classroom == null)
                throw new KeyNotFoundException("Classroom not found.");

            var isMember = classroom.ClassroomUsers
                .Any(cu => cu.UserId == userId);

            if (!isMember)
                throw new UnauthorizedAccessException("User is not a member of this classroom.");

            var decks = classroom.ClassroomDecks
                .Where(cd => cd.Deck != null)
                .Select(cd => cd.Deck!.ToResponseDto())
                .ToList();

            return decks;
        }

        private static string GenerateClassroomCode()
        {
            var guidBytes = Guid.NewGuid().ToByteArray();
            var randomBytes = RandomNumberGenerator.GetBytes(8);

            var combined = guidBytes.Concat(randomBytes).ToArray();

            return Convert.ToBase64String(combined)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }
    }
}