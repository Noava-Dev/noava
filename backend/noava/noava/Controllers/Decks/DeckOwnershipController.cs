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
    public class DeckOwnershipController : ControllerBase
    {
        private readonly IDeckOwnershipService _ownershipService;
        private readonly IUserService _userService;

        public DeckOwnershipController(IDeckOwnershipService ownershipService, IUserService userService)
        {
            _ownershipService = ownershipService;
            _userService = userService;
        }

        [HttpGet("deck/{deckId}/owners")]
        public async Task<ActionResult<List<DeckOwnerResponse>>> GetOwners(int deckId)
        {
            try
            {
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var owners = await _ownershipService.GetOwnersForDeckAsync(deckId, userId);
                return Ok(owners);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message }); 
            }
        }

        [HttpDelete("deck/{deckId}/owner/{ownerClerkId}")]
        public async Task<ActionResult> RemoveOwner(int deckId, string ownerClerkId)
        {
            try
            {
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var result = await _ownershipService.RemoveOwnerAsync(deckId, ownerClerkId, userId);

                if (!result)
                    return NotFound(new { error = "Owner not found" });

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });  
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("deck/{deckId}/is-owner")]
        public async Task<ActionResult<bool>> IsOwner(int deckId)
        {
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var isOwner = await _ownershipService.IsOwnerAsync(deckId, userId);
            return Ok(new { isOwner });
        }
    }
}