using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Models.Enums;
using noava.Models;
using noava.Services.Users;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        [Authorize(Roles = "ADMIN")]
            [HttpPut("{clerkId}/role")]
            public async Task<IActionResult> UpdateUserRole([FromRoute] string clerkId, [FromBody] UpdateRoleRequest request)
            {
                if (string.IsNullOrWhiteSpace(clerkId))
                {
                    return BadRequest(new { message = "User ID cannot be empty." });
                }

                if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
                {
                    return BadRequest(new { message = "Invalid role provided." });
                }

                var updatedUser = await _userService.UpdateUserRoleAsync(clerkId, newRole);

                if (updatedUser == null)
                {
                    return NotFound(new { message = "User not found in local database." });
                }

                return Ok(new
                {
                    message = "Role updated successfully",
                    role = updatedUser.Role.ToString()
                });
            }
        }
        public class UpdateRoleRequest
        {
            public string Role { get; set; } = string.Empty;
        }
    }