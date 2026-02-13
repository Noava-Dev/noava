using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs;
using noava.DTOs.Decks;
using noava.Services.Decks;
using noava.Services.Users;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeckInvitationController : ControllerBase
    {
        private readonly IDeckInvitationService _invitationService;
        private readonly IUserService _userService;

        public DeckInvitationController(IDeckInvitationService invitationService, IUserService userService)
        {
            _invitationService = invitationService;
            _userService = userService;
        }

        [HttpPost("deck/{deckId}/invite")]
        public async Task<ActionResult<DeckInvitationResponse>> InviteUser(
            int deckId,
            [FromBody] InviteUserRequest request)
        {
            try
            {
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var invitation = await _invitationService.InviteUserAsync(deckId, request, userId);
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
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var invitations = await _invitationService.GetInvitationsForDeckAsync(deckId, userId);
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
            var userId = _userService.GetUserId(User);
            if (userId == null)
                return Unauthorized();
            
            var invitations = await _invitationService.GetPendingInvitationsForUserAsync(userId);
            return Ok(invitations);
        }

        [HttpPost("{invitationId}/accept")]
        public async Task<ActionResult<DeckInvitationResponse>> AcceptInvitation(int invitationId)
        {
            try
            {
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var invitation = await _invitationService.AcceptInvitationAsync(invitationId, userId);

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
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var invitation = await _invitationService.DeclineInvitationAsync(invitationId, userId);

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
                var userId = _userService.GetUserId(User);
                if (userId == null)
                    return Unauthorized();
                
                var result = await _invitationService.CancelInvitationAsync(invitationId, userId);

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