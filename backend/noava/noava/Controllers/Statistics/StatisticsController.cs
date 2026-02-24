using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Cards;
using noava.DTOs.Statistics;
using noava.DTOs.StudySessions;
using noava.Exceptions;
using noava.Services.Cards;
using noava.Services.Statistics.Classrooms;
using noava.Services.Statistics.Decks;
using noava.Services.Statistics.General;
using noava.Services.StudySessions;
using noava.Services.Users;

namespace noava.Controllers.Statistics
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatisticsController : ControllerBase
    {
        private readonly IDeckStatsService _deckStatsService;
        private readonly IClassroomsStatsService _classroomsStatsService;
        private readonly IStatsService _statsService;
        private readonly IUserService _userService;
        private readonly ICardInteractionService _cardInteractionService;

        public StatisticsController(IDeckStatsService deckStatsService, IClassroomsStatsService classroomsStatsService, IStatsService statsService ,IUserService userService, ICardInteractionService cardInteractionService)
        {
            _deckStatsService = deckStatsService;
            _classroomsStatsService = classroomsStatsService;
            _statsService = statsService;
            _userService = userService;
            _cardInteractionService = cardInteractionService;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardStatisticsResponse>> GetGeneralStatistics()
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var statisticsResponse = await _statsService.GetGeneralStatsAsync(userId);
            return Ok(statisticsResponse);
        }

        [HttpGet("decks/{deckId:int}")]
        public async Task<ActionResult<DeckStatisticsResponse>> GetUserDeckStatistics(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var statisticsResponse= await _deckStatsService.GetDeckStatsAsync(deckId, userId);
            return Ok(statisticsResponse);
        }

        [HttpGet("classrooms/{classroomId:int}")]
        public async Task<ActionResult<DeckStatisticsResponse>> GetClassroomStatistics(int classroomId)
        {
            var statisticsResponse = await _classroomsStatsService.GetClassroomStatsAsync(classroomId);
            return Ok(statisticsResponse);
        }
        
        [HttpGet("decks/aggregate")]
        public async Task<ActionResult<DeckStatisticsResponse>> GetDeckStatisticsByUser(
            [FromQuery] IEnumerable<int> deckIds,
            [FromQuery] int classroomId,
            [FromQuery] string userId)
        {
            var teacherId = _userService.GetUserId(User);
            if (teacherId == null)
                return Unauthorized();

            if (deckIds == null || !deckIds.Any())
                return BadRequest("At least one deckId is required.");

            var statisticsResponse = await _deckStatsService
                .GetDeckStatsForTeacherAsync(
                    deckIds,
                    userId,
                    teacherId,
                    classroomId);

            if (statisticsResponse == null)
                return Forbid();

            return Ok(statisticsResponse);
        }

        [HttpGet("interactions/yearly")]
        public async Task<ActionResult<List<InteractionCount>>> GetInteractionsThisAndLastYear()
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var result = await _cardInteractionService
                .GetInteractionStatsAsync(userId);

            return Ok(result);
        }

        [HttpGet("interactions/by-decks/classroom/yearly")]
        public async Task<ActionResult<List<InteractionCount>>> GetInteractionStatsByDecksForClassroom(
            [FromQuery] string clerkId,
            [FromQuery] int classroomId,
            [FromQuery] IEnumerable<int> deckIds)
        {
            var actionTakerId = _userService.GetUserId(User);
            if (actionTakerId == null)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(clerkId))
                return BadRequest("clerkId is required.");

            if (deckIds == null || !deckIds.Any())
                return BadRequest("At least one deckId is required.");

            var result = await _cardInteractionService
                .GetInteractionStatsByDecksAsync(clerkId, actionTakerId, classroomId, deckIds);

            return Ok(result);
        }
    }
}