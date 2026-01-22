using Microsoft.AspNetCore.Mvc;
using noava.Models;
using noava.Services;
using noava.DTOs;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeckController : ControllerBase
    {
        private readonly DeckService _deckService;

        public DeckController(DeckService deckService)
        {
            _deckService = deckService;
        }

        // GET: api/deck
        [HttpGet]
        public async Task<ActionResult<List<Deck>>> GetAllDecks()
        {
            var decks = await _deckService.GetAllDecksAsync();
            return Ok(decks);
        }

        // GET: api/deck/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Deck>> GetDeck(int id)
        {
            var deck = await _deckService.GetDeckByIdAsync(id);
            if (deck == null) return NotFound();
            return Ok(deck);
        }

        // POST: api/deck
        [HttpPost]
        public async Task<ActionResult<Deck>> CreateDeck([FromBody] CreateDeckRequest request)
        {
            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility
            };

            var createdDeck = await _deckService.CreateDeckAsync(deck);
            return CreatedAtAction(nameof(GetDeck), new { id = createdDeck.DeckId }, createdDeck);
        }

        // PUT: api/deck/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Deck>> UpdateDeck(int id, [FromBody] UpdateDeckRequest request)
        {
            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility
            };

            var updatedDeck = await _deckService.UpdateDeckAsync(id, deck);
            if (updatedDeck == null) return NotFound();
            return Ok(updatedDeck);
        }

        // DELETE: api/deck/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDeck(int id)
        {
            var result = await _deckService.DeleteDeckAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}