using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.StudySessions;
using noava.Services.StudySessions;
using noava.Services.Users;
using noava.Exceptions;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudySessionController : ControllerBase
    {
        private readonly IStudySessionService _studySessionService;
        private readonly IUserService _userService;

        public StudySessionController(IStudySessionService studySessionService, IUserService userService)
        {
            _studySessionService = studySessionService;
            _userService = userService;
        }

        [HttpPost("start/{deckId:int}")]
        public async Task<ActionResult<StudySessionResponse>> StartSession(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException();

            var session = await _studySessionService.StartSessionAsync(deckId, userId);
            return Ok(session);
        }

        [HttpPut("end/{sessionId:int}")]
        public async Task<ActionResult<StudySessionResponse>> EndSession(int sessionId, [FromBody] EndStudySessionRequest request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException();

            var session = await _studySessionService.EndSessionAsync(sessionId, userId, request);
            return Ok(session);
        }

        [HttpGet("{sessionId}")]
        public async Task<ActionResult<StudySessionResponse>> GetSession(int sessionId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                throw new UnauthorizedException();

            var session = await _studySessionService.GetSessionAsync(sessionId, userId);
            return Ok(session);
        }
    }
}