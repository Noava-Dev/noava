using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Services.Interfaces;
using noava.DTOs.Request;
using noava.DTOs.Response;
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
        public async Task<ActionResult<List<DeckResponse>>> GetMyDecks()
        {
            var userId = GetUserId();
            var decks = await _deckService.GetUserDecksAsync(userId);
            return Ok(decks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DeckResponse>> GetDeck(int id)
        {
            var deck = await _deckService.GetDeckByIdAsync(id);
            if (deck == null) return NotFound();
            return Ok(deck);
        }

        [HttpPost]
        public async Task<ActionResult<DeckResponse>> CreateDeck([FromBody] DeckRequest request)
        {
            var userId = GetUserId();
            var createdDeck = await _deckService.CreateDeckAsync(request, userId);
            return CreatedAtAction(nameof(GetDeck), new { id = createdDeck.DeckId }, createdDeck);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeckResponse>> UpdateDeck(int id, [FromBody] DeckRequest request)
        {
            var userId = GetUserId();
            var updatedDeck = await _deckService.UpdateDeckAsync(id, request, userId);
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