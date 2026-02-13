using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Notifications;
using noava.Services.Notifications;
using noava.Services.Users;

namespace noava.Controllers.Notifications
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public NotificationsController(INotificationService notificationService, IUserService userService)
        {
            _notificationService = notificationService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var notifications = await _notificationService.GetNotificationsForUserAsync(userId);
            return Ok(notifications);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetMyNotificationCount()
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var notifications = await _notificationService.GetNotificationsForUserAsync(userId);

            return Ok(new { count = notifications.Count });
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var notification = await _notificationService.GetNotificationByIdAsync(id, userId);
            if (notification == null)
                return NotFound();

            return Ok(notification);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _notificationService.CreateNotificationAsync(dto);

            return CreatedAtAction(nameof(GetMyNotifications), null);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteNotification(long id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            await _notificationService.DeleteNotificationAsync(id, userId);
            return NoContent();
        }
    }
}