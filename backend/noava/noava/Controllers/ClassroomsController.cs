using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using noava.Services.Contracts;
using noava.Temp.DTOs.request;
using noava.Temp.DTOs.response;
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

        [HttpPost]
        public async Task<ActionResult<ClassroomResponseDto>> Create([FromBody] ClassroomRequestDto request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await _classroomService.CreateAsync(request, userId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassroomResponseDto>>> GetAllForUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await _classroomService.GetAllByUserAsync(userId);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> GetById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await _classroomService.GetByIdAsync(id, userId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("join/{joinCode}")]
        public async Task<ActionResult<ClassroomResponseDto>> JoinByCode(
            string joinCode)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await _classroomService
                .JoinByClassroomCode(joinCode, userId);

            if (result == null)
                return NotFound("Invalid join code");

            return Ok(result);
        }
    }
}
