using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using noava.DTOs.Schools;
using noava.Mappers.Schools;
using noava.Models.Enums;
using noava.Services.Contracts;
using noava.Shared.Clerk;
using System.Security.Claims;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SchoolsController : ControllerBase
    {
        private readonly ISchoolService _schoolService;
        private readonly IClerkService _clerkservice;
        private readonly IUserService _userService;
        private string GetCurrentUserId()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User not logged in.");
            return userId;
        }

        public SchoolsController(ISchoolService schoolService, IClerkService clerkService, IUserService userService)
        {
            _schoolService = schoolService;
            _clerkservice = clerkService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SchoolDetailsDto>>> GetAll()
        {
            var schools = await _schoolService.GetAllSchoolsAsync();
            var result = new List<SchoolDetailsDto>();
            foreach(var school in schools)
            {
                var clerkIds = school.SchoolAdmins.Select(sa => sa.UserId).ToList();
                var schoolAdmins = await _clerkservice.GetUsersByClerkIdsAsync(clerkIds);
                result.Add(SchoolMapper.ToDetailsDto(school, schoolAdmins));
            }

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SchoolDetailsDto>> GetById(int id)
        {
            var school = await _schoolService.GetSchoolByIdAsync(id);
            var clerkIds = school.SchoolAdmins.Select(sa => sa.UserId).ToList();
            var schoolAdmins = await _clerkservice.GetUsersByClerkIdsAsync(clerkIds);
            return Ok(SchoolMapper.ToDetailsDto(school, schoolAdmins));
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<SchoolDetailsDto>> Create(
            [FromBody] CreateSchoolRequestDto request)
        {
            var createdByUserId = GetCurrentUserId();
            var school = await _schoolService.CreateSchoolAsync(
                request.Name,
                createdByUserId,
                request.SchoolAdminEmails
            );
            var clerkIds = school.SchoolAdmins.Select(sa => sa.UserId).ToList();
            var schoolAdmins = await _clerkservice.GetUsersByClerkIdsAsync(clerkIds);

            return CreatedAtAction(
                nameof(GetById),
                new { id = school.Id },
                SchoolMapper.ToDetailsDto(school, schoolAdmins)
    );
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<SchoolDetailsDto>> UpdateSchool(
            int id,
            [FromBody] UpdateSchoolDetailsRequestDto request)
        {
            // Update the name
            var school = await _schoolService.UpdateSchoolAsync(id, request.SchoolName);

            var exisitingAdmins = school.SchoolAdmins.Select(sa => sa.UserId).ToList();
            var incomingAdmins =
                    await _clerkservice.GetClerkUserIdByEmailsAsync(request.SchoolAdminEmails);

            var schoolAdminsToAdd = incomingAdmins.Except(exisitingAdmins);
            if (schoolAdminsToAdd.Any())
            {
                await _schoolService.AddSchoolAdminsAsync(id, schoolAdminsToAdd);
            }

            var schoolAdminsToRemove = exisitingAdmins.Except(incomingAdmins);
            if (schoolAdminsToRemove.Any())
            {
                await _schoolService.RemoveSchoolAdminsAsync(id, schoolAdminsToRemove);
            }

            var schoolAdmins = await _clerkservice.GetUsersByClerkIdsAsync(incomingAdmins.ToList());

            return Ok(SchoolMapper.ToDetailsDto(school, schoolAdmins));
        }


        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _schoolService.DeleteSchoolAsync(id);
            return NoContent();
        }
    }
}
