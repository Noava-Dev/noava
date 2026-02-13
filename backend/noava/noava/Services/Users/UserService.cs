using noava.Models;
using noava.Models.Enums;
using noava.Repositories.Users;
using System.Security.Claims;

namespace noava.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
    }
}