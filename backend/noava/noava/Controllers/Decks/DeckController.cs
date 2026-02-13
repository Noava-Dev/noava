using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Decks;
using noava.Services.Decks;
using noava.Services.Users;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeckController : ControllerBase
    {
        private readonly IDeckService _deckService;
        private readonly IUserService _userService;

        public DeckController(IDeckService deckService, IUserService userService)
        {
            _deckService = deckService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DeckResponse>>> GetAllDecks()
        {
            var decks = await _deckService.GetAllDecksAsync();
            return Ok(decks);
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<DeckResponse>>> GetMyDecks([FromQuery] int? limit = null)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var decks = await _deckService.GetUserDecksAsync(userId, limit);
            return Ok(decks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DeckResponse>> GetDeck(int id)
        {
            var deck = await _deckService.GetDeckByIdAsync(id);
            if (deck == null) return NotFound();
            return Ok(deck);
        }

        [HttpGet("multiple")]
        public async Task<ActionResult<DeckResponse>> GetDecksByIds([FromQuery] int[] ids)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var deck = await _deckService.GetDeckByIdsAsync(ids, userId);
            return Ok(deck);
        }

        [HttpPost]
        public async Task<ActionResult<DeckResponse>> CreateDeck([FromBody] DeckRequest request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var createdDeck = await _deckService.CreateDeckAsync(request, userId);
            return CreatedAtAction(nameof(GetDeck), new { id = createdDeck.DeckId }, createdDeck);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeckResponse>> UpdateDeck(int id, [FromBody] DeckRequest request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var updatedDeck = await _deckService.UpdateDeckAsync(id, request, userId);
            if (updatedDeck == null) return NotFound();
            return Ok(updatedDeck);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDeck(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var result = await _deckService.DeleteDeckAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}