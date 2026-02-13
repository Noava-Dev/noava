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
    }
}