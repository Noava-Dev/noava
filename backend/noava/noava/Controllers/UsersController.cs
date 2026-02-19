using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

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

        [HttpGet("email-preferences")]
        public async Task<IActionResult> GetEmailPreferences()
        {
            var clerkId = _userService.GetUserId(User);
            if (clerkId == null)
                return Unauthorized();

            var receiveEmails = await _userService.GetUserEmailNotificationsPreference(clerkId);

            return Ok(receiveEmails);
        }

        [HttpPut("email-preferences")]
        public async Task<IActionResult> UpdateEmailPreferences([FromBody] bool receive)
        {
            var clerkId = _userService.GetUserId(User);
            if (clerkId == null)
                return Unauthorized();

            await _userService.UpdateReceiveNotificationEmails(clerkId, receive);

            return Ok();
        }
    }
}