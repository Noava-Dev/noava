using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Models;
using noava.Models.Enums;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services.Implementations
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
    }
}