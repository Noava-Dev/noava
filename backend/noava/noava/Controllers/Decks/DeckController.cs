using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using noava.DTOs.Decks;
using noava.Services.Decks;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeckController : ControllerBase
    {
        private readonly IDeckService _deckService;

        public DeckController(IDeckService deckService)
        {
            _deckService = deckService;
        }

        // TODO: Move to UserService
        private string GetUserId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
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
            var userId = GetUserId();
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
            var userId = GetUserId();

            var deck = await _deckService.GetDeckByIdsAsync(ids, userId);
            return Ok(deck);
        }

        [HttpPost]
        public async Task<ActionResult<DeckResponse>> CreateDeck([FromBody] DeckRequest request)
        {
            var userId = GetUserId();

            try
            {
                var createdDeck = await _deckService.CreateDeckAsync(request, userId);
                return CreatedAtAction(nameof(GetDeck), new { id = createdDeck.DeckId }, createdDeck);
            }
            catch (ArgumentException ex)  
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeckResponse>> UpdateDeck(int id, [FromBody] DeckRequest request)
        {
            var userId = GetUserId();

            try
            {
                var updatedDeck = await _deckService.UpdateDeckAsync(id, request, userId);
                if (updatedDeck == null) return NotFound();
                return Ok(updatedDeck);
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDeck(int id)
        {
            var userId = GetUserId();
            var result = await _deckService.DeleteDeckAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}