using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs;
using noava.DTOs.Decks;
using noava.Services.Decks;
using System.Security.Claims;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeckInvitationController : ControllerBase
    {
        private readonly IDeckInvitationService _invitationService;

        public DeckInvitationController(IDeckInvitationService invitationService)
        {
            _invitationService = invitationService;
        }

        private string GetClerkId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
        }

        [HttpPost("deck/{deckId}/invite")]
        public async Task<ActionResult<DeckInvitationResponse>> InviteUser(
            int deckId,
            [FromBody] InviteUserRequest request)
        {
            try
            {
                var clerkId = GetClerkId();
                var invitation = await _invitationService.InviteUserAsync(deckId, request, clerkId);
                return Ok(invitation);
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

        [HttpGet("deck/{deckId}")]
        public async Task<ActionResult<List<DeckInvitationResponse>>> GetInvitationsForDeck(int deckId)
        {
            try
            {
                var clerkId = GetClerkId();
                var invitations = await _invitationService.GetInvitationsForDeckAsync(deckId, clerkId);
                return Ok(invitations);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });  
            }
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<DeckInvitationResponse>>> GetPendingInvitations()
        {
            var clerkId = GetClerkId();
            var invitations = await _invitationService.GetPendingInvitationsForUserAsync(clerkId);
            return Ok(invitations);
        }

        [HttpPost("{invitationId}/accept")]
        public async Task<ActionResult<DeckInvitationResponse>> AcceptInvitation(int invitationId)
        {
            try
            {
                var clerkId = GetClerkId();
                var invitation = await _invitationService.AcceptInvitationAsync(invitationId, clerkId);

                if (invitation == null)
                    return NotFound(new { error = "Invitation not found" });

                return Ok(invitation);
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

        [HttpPost("{invitationId}/decline")]
        public async Task<ActionResult<DeckInvitationResponse>> DeclineInvitation(int invitationId)
        {
            try
            {
                var clerkId = GetClerkId();
                var invitation = await _invitationService.DeclineInvitationAsync(invitationId, clerkId);

                if (invitation == null)
                    return NotFound(new { error = "Invitation not found" });

                return Ok(invitation);
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

        [HttpDelete("{invitationId}")]
        public async Task<ActionResult> CancelInvitation(int invitationId)
        {
            try
            {
                var clerkId = GetClerkId();
                var result = await _invitationService.CancelInvitationAsync(invitationId, clerkId);

                if (!result)
                    return NotFound(new { error = "Invitation not found" });

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
    }
}