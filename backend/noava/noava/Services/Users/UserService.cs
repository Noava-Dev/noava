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
                Role = UserRole.USER,
                ReceiveNotificationEmails = true
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
            var localUsers = await _userRepository.GetAllLocalUsersAsync();

            if (!localUsers.Any())
                return Enumerable.Empty<ClerkUserResponseDto>();

            var clerkIds = localUsers.Select(u => u.ClerkId).ToList();

            // only getting clerk users that are in the local db too
            // this way the userRoles match up
            var clerkUsers = await _clerkService.GetUsersAsync(clerkIds);
            foreach (var clerkUser in clerkUsers)
            {
                var matchingLocalUser = localUsers.FirstOrDefault(u => u.ClerkId == clerkUser.ClerkId);
                if (matchingLocalUser != null)
                {
                    clerkUser.Role = matchingLocalUser.Role.ToString();
                }
            }

            return clerkUsers;
        }

        public async Task<bool> DeleteUserAsync(string clerkUserId)
        {
            await _userRepository.DeleteByClerkIdAsync(clerkUserId);

            var clerkDeleted = await _clerkService.DeleteUserAsync(clerkUserId);

            return clerkDeleted;
        }
        public async Task<User?> UpdateUserRoleAsync(string clerkId, UserRole newRole)
        {
            return await _userRepository.UpdateRoleAsync(clerkId, newRole);
        }

        public async Task<string> GetUserRoleByClerkIdAsync(string clerkId)
        {
            var user =  await _userRepository.GetByClerkIdAsync(clerkId);
            return user?.Role.ToString() ?? "USER";
        }

        public async Task<bool> IsAdminAsync(string clerkId)
        {
            var user = await _userRepository.GetByClerkIdAsync(clerkId);

            return user != null && user.Role == UserRole.ADMIN;
        }

        public async Task UpdateReceiveNotificationEmails(string clerkId, bool receive)
        {
           await _userRepository.UpdateReceiveNotificationEmailsAsync(clerkId, receive);
        }

        public async Task<bool> GetUserEmailNotificationsPreference(string clerkId)
        {
            return await _userRepository.GetReceiveNotificationEmailsAsync(clerkId);
        }
    }
}