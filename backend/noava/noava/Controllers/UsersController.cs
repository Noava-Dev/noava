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
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var user = await _userService.SyncUserAsync(userId);

            return Ok(new
            {
                user.ClerkId,
                Role = user.Role.ToString()
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{clerkId}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string clerkId)
        {
            if (string.IsNullOrWhiteSpace(clerkId))
            {
                return BadRequest(new { message = "User ID cannot be empty." });
            }

            var success = await _userService.DeleteUserAsync(clerkId);

            if (!success)
            {
                return BadRequest(new { message = "Failed to delete user from Clerk." });
            }

            return NoContent();
        }
    }
}