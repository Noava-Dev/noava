using noava.DTOs.Clerk;
using noava.Models;
using noava.Models.Enums;
using noava.Repositories.Users;
using noava.Shared;
using System.Security.Claims;

namespace noava.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IClerkService _clerkService;

        public UserService(IUserRepository userRepository, IClerkService clerkService)
        {
            _userRepository = userRepository;
            _clerkService = clerkService;
        }

        public async Task<User> SyncUserAsync(string clerkId)
        {
            var user = await _userRepository.GetByClerkIdAsync(clerkId);

            if (user != null)
                return user;

            var newUser = new User
            {
                ClerkId = clerkId,
                Role = UserRole.USER
            };

            return await _userRepository.CreateAsync(newUser);
        }

        public string? GetUserId(ClaimsPrincipal? user)
        {
            var clerkUserId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrWhiteSpace(clerkUserId) ? null : clerkUserId;
        }

        public async Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersAsync()
        {
            return await _clerkService.GetAllUsersAsync();
        }

        public async Task<bool> DeleteUserAsync(string clerkUserId)
        {
            await _userRepository.DeleteByClerkIdAsync(clerkUserId);

            var clerkDeleted = await _clerkService.DeleteUserAsync(clerkUserId);

            return clerkDeleted;
        }
    }
}