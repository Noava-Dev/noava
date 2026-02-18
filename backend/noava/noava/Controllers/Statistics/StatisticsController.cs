using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Statistics;
using noava.DTOs.StudySessions;
using noava.Exceptions;
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
        private readonly IStatsService _statsService;
        private readonly IUserService _userService;

        public StatisticsController(IDeckStatsService deckStatsService, IStatsService statsService ,IUserService userService)
        {
            _deckStatsService = deckStatsService;
            _statsService = statsService;
            _userService = userService;
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

        [HttpGet("{deckId:int}")]
        public async Task<ActionResult<DeckStatisticsResponse>> GetUserDeckStatistics(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var statisticsResponse= await _deckStatsService.GetDeckStatsAsync(deckId, userId);
            return Ok(statisticsResponse);
        }
    }
}