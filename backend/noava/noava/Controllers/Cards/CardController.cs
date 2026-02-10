using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using noava.DTOs.Cards;
using noava.Services.Cards;
using Azure.Core;
using noava.Models;

namespace noava.Controllers.Cards
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;
        private readonly ICardImportService _cardImportService;

        public CardController(ICardService cardService, ICardImportService cardImportService)
        {
            _cardService = cardService;
            _cardImportService = cardImportService;
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

        [HttpPost("deck/{deckId}/import")]
        public async Task<ActionResult<int>> ImportCards(int deckId, [FromForm] IFormFile file)
        {
            var userId = GetUserId();

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            try
            {
                var count = await _cardImportService.ImportCardsAsync(deckId, file, userId);
                return Ok(count);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
    }
}