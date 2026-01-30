using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Response;
using noava.Services.Contracts;
using System.Security.Claims;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeckOwnershipController : ControllerBase
    {
        private readonly IDeckOwnershipService _ownershipService;

        public DeckOwnershipController(IDeckOwnershipService ownershipService)
        {
            _ownershipService = ownershipService;
        }

        private string GetClerkId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
        }

        [HttpGet("deck/{deckId}/owners")]
        public async Task<ActionResult<List<DeckOwnerResponse>>> GetOwners(int deckId)
        {
            try
            {
                var clerkId = GetClerkId();
                var owners = await _ownershipService.GetOwnersForDeckAsync(deckId, clerkId);
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
                var clerkId = GetClerkId();
                var result = await _ownershipService.RemoveOwnerAsync(deckId, ownerClerkId, clerkId);

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
            var clerkId = GetClerkId();
            var isOwner = await _ownershipService.IsOwnerAsync(deckId, clerkId);
            return Ok(new { isOwner });
        }
    }
}