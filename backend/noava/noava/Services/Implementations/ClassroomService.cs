using noava.DTOs.Request.Classrooms;
using noava.DTOs.Response.Classrooms;
using noava.Mappers.Classrooms;
using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;
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