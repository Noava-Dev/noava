using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Models;
using noava.Services.Contracts;
using noava.DTOs;
using System.Security.Claims;

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

        private string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
               throw new UnauthorizedAccessException("User ID not found");
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<List<Deck>>> GetAllDecks()
        {
            var decks = await _deckService.GetAllDecksAsync();
            return Ok(decks);
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<Deck>>> GetMyDecks()
        {
            var userId = GetUserId();
            var decks = await _deckService.GetUserDecksAsync(userId);
            return Ok(decks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Deck>> GetDeck(int id)
        {
            var deck = await _deckService.GetDeckByIdAsync(id);
            if (deck == null) return NotFound();
            return Ok(deck);
        }

        [HttpPost]
        public async Task<ActionResult<Deck>> CreateDeck([FromBody] CreateDeckRequest request)
        {
            var userId = GetUserId();

            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility,
                CoverImageBlobName = request.CoverImageBlobName,
                UserId = userId
            };

            var createdDeck = await _deckService.CreateDeckAsync(deck);
            return CreatedAtAction(nameof(GetDeck), new { id = createdDeck.DeckId }, createdDeck);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Deck>> UpdateDeck(int id, [FromBody] UpdateDeckRequest request)
        {
            var userId = GetUserId();

            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility,
                CoverImageBlobName = request.CoverImageBlobName,
                UserId = userId
            };

            var updatedDeck = await _deckService.UpdateDeckAsync(id, deck, userId);
            if (updatedDeck == null) return NotFound();
            return Ok(updatedDeck);
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