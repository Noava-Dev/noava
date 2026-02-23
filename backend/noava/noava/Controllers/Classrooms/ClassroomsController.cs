using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Classrooms;
using noava.DTOs.Clerk;
using noava.DTOs.Decks;
using noava.Exceptions;
using noava.Services.Classrooms;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers.Classrooms
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClassroomsController : ControllerBase
    {
        private readonly IClassroomService _classroomService;
        private readonly IUserService _userService;

        public ClassroomsController(IClassroomService classroomService, IUserService userService)
        {
            _classroomService = classroomService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<ClassroomResponseDto>> Create([FromBody] ClassroomRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = _userService.GetUserId(User);
            if (userId == null) 
                return Unauthorized();
            
            var result = await _classroomService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassroomResponseDto>>> GetAllForUser()
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) throw new UnauthorizedException("Not authorized");

            var result = await _classroomService.GetAllByUserAsync(userId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> GetById(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) throw new UnauthorizedException("Not authorized");

            var result = await _classroomService.GetByIdAsync(id, userId);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{classroomId:int}/decks")]
        public async Task<ActionResult<List<DeckResponse>>> GetDecksByClassroom(int classroomId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();

            try
            {
                var decks = await _classroomService.GetDecksForClassroomAsync(classroomId, userId);
                return Ok(decks);
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

        [HttpPost("{id:int}/invite")]
        public async Task<ActionResult<ClassroomResponseDto>> InviteUserByEmail(int id, [FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _classroomService.InviteUserByEmail(id,userId,email);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpGet("{id:int}/users")]
        public async Task<ActionResult<IEnumerable<ClerkUserResponseDto>>> GetUsersByClassroom(
            int id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) 
                return Unauthorized();

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 50;

            try
            {
                var users = await _classroomService.GetAllUsersByClassroomAsync(id, page, pageSize);
                return Ok(users);
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


        [HttpPost("join/{joinCode}")]
        public async Task<ActionResult<ClassroomResponseDto>> JoinByCode(string joinCode)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var result = await _classroomService.JoinByClassroomCode(joinCode, userId);
            if (result == null) return NotFound("Invalid join code");

            return Ok(result);
        }

        [HttpPost("{classroomId:int}/decks/{deckId:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> AddDeck(int classroomId, int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _classroomService.AddDeckAsync(classroomId, deckId, userId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
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

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> Update(int id, [FromBody] ClassroomRequestDto request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

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
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

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

        [HttpDelete("{classroomId:int}/users/{targetUserId}")]
        public async Task<ActionResult<ClassroomResponseDto>> RemoveUser(int classroomId, string targetUserId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _classroomService.RemoveUserAsync(classroomId, targetUserId, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete("{classroomId:int}/decks/{deckId:int}")]
        public async Task<ActionResult<ClassroomResponseDto>> RemoveDeck(int classroomId, int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _classroomService.RemoveDeckAsync(classroomId, deckId, userId);
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

        [HttpPut("{classroomId:int}/users/{targetUserId}/role")]
        public async Task<ActionResult<ClassroomResponseDto>> SetUserRole(int classroomId,string targetUserId,[FromQuery] bool isTeacher)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _classroomService.SetUserTeacherStatusAsync(
                    classroomId, targetUserId, userId, isTeacher);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPut("{id:int}/joincode")]
        public async Task<ActionResult<ClassroomResponseDto>> UpdateJoinCode(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

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