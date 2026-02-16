using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Decks;
using noava.Services.Decks;
using noava.DTOs.Clerk;
using noava.Models;
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

        [HttpGet("user/all")]
        public async Task<ActionResult<List<DeckResponse>>> GetUserDecks([FromQuery] int? limit = null)
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
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var canView = await _deckService.CanUserViewDeckAsync(id, userId);
            if (!canView)
                return NotFound(); 

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

            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var canView = await _deckService.CanUserViewDeckAsync(id, userId);
            if (!canView)
                return NotFound();
                
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
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
                
            var canDelete = await _deckService.CanUserViewDeckAsync(id, userId);
            if (!canDelete)
                return NotFound(); 

            var result = await _deckService.DeleteDeckAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }
        
        [HttpPost("{deckId:int}/invite")]
        public async Task<ActionResult<DeckResponse>> InviteUserByEmail(
       int deckId,
       [FromQuery] string email,
       [FromQuery] bool isOwner = false)  // ← ADD: Default false
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _deckService.InviteUserByEmailAsync(deckId, userId, email, isOwner);  
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }


        [HttpPost("join/{joinCode}")]
        public async Task<ActionResult<DeckResponse>> JoinByCode(
            string joinCode,
            [FromQuery] bool isOwner = false)  
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _deckService.JoinByJoinCodeAsync(joinCode, userId, isOwner);  
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpPut("{deckId:int}/joincode")]
        public async Task<ActionResult<DeckResponse>> UpdateJoinCode(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _deckService.UpdateJoinCodeAsync(deckId, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }

        }

        [HttpGet("{deckId:int}/users")]
        public async Task<ActionResult<IEnumerable<ClerkUserResponseDto>>> GetUsersByDeck(
            int deckId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
                {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 50;

            try
            {
                var users = await _deckService.GetAllUsersByDeckAsync(deckId, page, pageSize, userId);
                return Ok(users);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{deckId:int}/users/{targetUserId}")]
        public async Task<ActionResult<DeckResponse>> RemoveUser(int deckId, string targetUserId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            try
            {
                var result = await _deckService.RemoveUserAsync(deckId, targetUserId, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}