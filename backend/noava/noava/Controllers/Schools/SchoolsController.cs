using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Schools;
using noava.Services.Schools;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers.Schools
{
    //Changed the controller slightly because i had issues with the role enforcing
    //later on this allow anonymous should be removed
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolsController : ControllerBase
    {
        private readonly ISchoolService _schoolService;
        private string GetCurrentUserId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
        }

        public SchoolsController(ISchoolService schoolService)
        {
            _schoolService = schoolService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SchoolResponseDto>>> GetAll()
        {
            var schools = await _schoolService.GetAllSchoolsAsync();
            return Ok(schools);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SchoolResponseDto>> GetById(int id)
        {
            try
            {
                var school = await _schoolService.GetSchoolByIdAsync(id);
                return Ok(school);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSchool([FromBody] SchoolRequestDto request)
        {
            try
            {
                var createdByUserId = GetCurrentUserId();
                request.CreatedBy = createdByUserId;

                await _schoolService.CreateSchoolAsync(request);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSchool(int id, [FromBody] SchoolRequestDto request)
        {
            await _schoolService.UpdateSchoolAsync(id, request);
            return Ok();
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSchool(int id)
        {
            try
            {
                await _schoolService.DeleteSchoolAsync(id);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        //only add one admin at a time
        [HttpPut("{id:int}/admins/{userEmail}")]
        public async Task<IActionResult> AddSchoolAdmin(int id, string userEmail)
        {
            try
            {
                await _schoolService.AddSchoolAdminAsync(id, userEmail);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        //only delete one admin at a time
        [HttpDelete("{id:int}/admins/{clerkId}")]
        public async Task<IActionResult> RemoveSchoolAdmin(int id, string clerkId)
        {
            //no null check? school should have one minimum schooladmin
            try
            {
                await _schoolService.RemoveSchoolAdminAsync(id, clerkId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
