using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Request.Classrooms;
using noava.DTOs.Response.Classrooms;
using noava.Services.Contracts;
using System.Security.Claims;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClassroomsController : ControllerBase
    {
        private readonly IClassroomService _classroomService;

        public ClassroomsController(IClassroomService classroomService)
        {
            _classroomService = classroomService;
        }

        private string? GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        [HttpPost]
        public async Task<ActionResult<ClassroomResponseDto>> Create([FromBody] ClassroomRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _classroomService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassroomResponseDto>>> GetAllForUser()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _classroomService.GetAllByUserAsync(userId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> GetById(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _classroomService.GetByIdAsync(id, userId);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPost("join/{joinCode}")]
        public async Task<ActionResult<ClassroomResponseDto>> JoinByCode(string joinCode)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _classroomService.JoinByClassroomCode(joinCode, userId);
            if (result == null) return NotFound("Invalid join code");

            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> Update(int id, [FromBody] ClassroomRequestDto request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _classroomService.UpdateAsync(id, request, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _classroomService.DeleteAsync(id, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPut("{id:int}/joincode")]
        public async Task<ActionResult<ClassroomResponseDto>> UpdateJoinCode(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _classroomService.UpdateJoinCode(id, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}