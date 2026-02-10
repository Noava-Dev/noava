using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Cards;
using noava.Models.Enums;
using noava.Services.Cards;
using System.Security.Claims;

namespace noava.Controllers.Cards
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardController(ICardService cardService)
        {
            _cardService = cardService;
        }

        private string GetUserId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
        }
        
        [HttpGet("deck/{deckId}")]
        public async Task<ActionResult<List<CardResponse>>> GetCardsByDeckId(int deckId)
        {
            var userId = GetUserId();
            var cards = await _cardService.GetCardsByDeckIdAsync(deckId, userId);
            return Ok(cards);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardResponse>> GetCard(int id)
        {
            var userId = GetUserId();
            var card = await _cardService.GetCardByIdAsync(id, userId);
            if (card == null) return NotFound();
            return Ok(card);
        }

        [HttpGet("bulk-review")]
        public async Task<ActionResult<List<CardResponse>>> GetBulkReviewCards(
            [FromQuery] List<int> deckIds,
            [FromQuery] BulkReviewMode mode)
        {
            var userId = GetUserId();

            if (deckIds == null || deckIds.Count == 0)
                return BadRequest("DeckIds can not be empty");

            var cards = await _cardService.GetBulkReviewCardsAsync(
                deckIds,
                userId,
                mode
            );

            return Ok(cards);
        }

        [HttpPost("deck/{deckId}")]
        public async Task<ActionResult<CardResponse>> CreateCard(
            int deckId,
            [FromBody] CardRequest request)
        {
            var userId = GetUserId();
            var createdCard = await _cardService.CreateCardAsync(deckId, request, userId);
            return CreatedAtAction(nameof(GetCard), new { id = createdCard.CardId }, createdCard);
        }

      
        [HttpPut("{id}")]
        public async Task<ActionResult<CardResponse>> UpdateCard(
            int id,
            [FromBody] CardRequest request)
        {
            var userId = GetUserId();
            var updatedCard = await _cardService.UpdateCardAsync(id, request, userId);
            if (updatedCard == null) return NotFound();
            return Ok(updatedCard);
        }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCard(int id)
        {
            var userId = GetUserId();
            var result = await _cardService.DeleteCardAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}