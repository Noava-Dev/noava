using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;
using noava.Temp.DTOs.request;
using noava.Temp.DTOs.response;
using noava.Temp.Mappers.Classrooms;
using System.Security.Cryptography;

namespace noava.Services.Implementations
{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _classroomRepository;

        public ClassroomService(IClassroomRepository classroomRepository)
        {
            _classroomRepository = classroomRepository;
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

            return classroom.ToResponseDto();
        }

        public async Task<IEnumerable<ClassroomResponseDto>> GetAllByUserAsync(string userId)
        {
            var classrooms = await _classroomRepository.GetAllByUserAsync(userId);
            return classrooms.ToResponseDtos();
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

            return classroom.ToResponseDto();
        }

        public async Task<ClassroomResponseDto?> GetByJoinCodeAsync(string joinCode)
        {
            var classroom = await _classroomRepository.GetByJoinCodeAsync(joinCode);
            return classroom?.ToResponseDto();
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

            return classroom.ToResponseDto();
        }
    }
}