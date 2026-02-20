using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Cards;
using noava.Models.Enums;
using noava.Services.Cards;
using noava.Services.Users;

namespace noava.Controllers.Cards
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;
        private readonly ICardImportService _cardImportService;
        private readonly IUserService _userService;

        public CardController(ICardService cardService, ICardImportService cardImportService, IUserService userService)
        {
            _cardService = cardService;
            _cardImportService = cardImportService;
            _userService = userService;
        }
        
        [HttpGet("deck/{deckId}")]
        public async Task<ActionResult<List<CardResponse>>> GetCardsByDeckId(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();
            
            var cards = await _cardService.GetCardsByDeckIdAsync(deckId, userId);
            return Ok(cards);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardResponse>> GetCard(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();

            var card = await _cardService.GetCardByIdAsync(id, userId);
            if (card == null) return NotFound();
            return Ok(card);
        }

        [HttpGet("bulk-review")]
        public async Task<ActionResult<List<CardResponse>>> GetBulkReviewCards(
            [FromQuery] List<int> deckIds,
            [FromQuery] ReviewMode mode)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();

            if (deckIds == null || deckIds.Count == 0)
                return BadRequest("DeckIds can not be empty");

            var cards = await _cardService.GetBulkReviewCardsAsync(
                deckIds,
                userId,
                mode
            );

            return Ok(cards);
        }

        [HttpGet("{deckId}/spaced")]
        public async Task<ActionResult<List<CardResponse>>> GetAllCardsByDeckIdLongterm(int deckId, [FromQuery] ReviewMode mode)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) 
                return Unauthorized();

            var cards = await _cardService.GetAllCardsLongtermAsync(
                deckId,
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
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();
            
            var createdCard = await _cardService.CreateCardAsync(deckId, request, userId);
            return CreatedAtAction(nameof(GetCard), new { id = createdCard.CardId }, createdCard);
        }

      
        [HttpPut("{id}")]
        public async Task<ActionResult<CardResponse>> UpdateCard(
            int id,
            [FromBody] CardRequest request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();
            
            var updatedCard = await _cardService.UpdateCardAsync(id, request, userId);
            if (updatedCard == null) return NotFound();
            return Ok(updatedCard);
        }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCard(int id)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();
            
            var result = await _cardService.DeleteCardAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("deck/{deckId}/import")]
        public async Task<ActionResult<int>> ImportCards(int deckId, [FromForm] IFormFile file)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) return Unauthorized();

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