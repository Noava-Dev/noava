using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Cards;
using noava.DTOs.Cards.Interactions;
using noava.DTOs.Cards.Progress;
using noava.Models.Enums;
using noava.Services.Cards;
using noava.Services.Users;

namespace noava.Controllers.Cards
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardInteractionsController : ControllerBase
    {
        private readonly ICardInteractionService _cardInteractionService;
        private readonly ICardImportService _cardImportService;
        private readonly IUserService _userService;

        public CardInteractionsController(ICardInteractionService cardInteractionService, ICardImportService cardImportService, IUserService userService)
        {
            _cardInteractionService = cardInteractionService;
            _cardImportService = cardImportService;
            _userService = userService;
        }

        [HttpPost("{StudySessionId:int}/{DeckId:int}/{CardId:int}")]
        public async Task<ActionResult<List<CardProgressResponse>>> CreateCardInteraction(int StudySessionId, int deckId, int cardId, [FromBody] CardInteractionRequest request)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null) 
                return Unauthorized();

            var cardProgress = await _cardInteractionService.CreateCardInteractionAsync(StudySessionId, deckId, cardId, userId, request);
            return Ok(cardProgress);
        }
    }
}