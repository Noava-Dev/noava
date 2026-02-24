using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using noava.DTOs.ContactMessages;
using noava.Exceptions;
using noava.Models;
using noava.Models.Enums;
using noava.Services.ContactMessages;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers.ContactMessages
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class ContactMessagesController : ControllerBase
    {
        private readonly IContactMessageService _contactMessageService;
        private readonly IUserService _userService;

        public ContactMessagesController(IContactMessageService contactMessageService, IUserService userService)
        {
            _contactMessageService = contactMessageService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ContactMessageFilterDto filter)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException("Not authorized");

            var result = await _contactMessageService
                .GetAllAsync(userId, filter);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException("Not authorized");

            var result = await _contactMessageService.GetByIdAsync(id, userId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromQuery] ContactMessageStatus status)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException("Not authorized");

            var result = await _contactMessageService
                .UpdateStatusAsync(id, userId, status);

            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        [EnableRateLimiting("contact-messages")]
        public async Task<IActionResult> Create([FromBody] ContactMessageRequest dto)
        {
            var response = await _contactMessageService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = response.Id },
                response
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException("Not authorized");

            await _contactMessageService.DeleteAsync(id, userId);

            return NoContent();
        }
    }
}