using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> SyncUser()
        {
            var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                          User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(clerkId))
                return Unauthorized("No ClerkId found in token.");

            var user = await _userService.SyncUserAsync(clerkId);

            return Ok(new
            {
                user.ClerkId,
                Role = user.Role.ToString()
            });
        }
    }
}