using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Schools;
using noava.Mappers;
using noava.Services.Contracts;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SchoolsController : ControllerBase
    {
        private readonly ISchoolService _schoolService;

        public SchoolsController(ISchoolService schoolService)
        {
            _schoolService = schoolService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SchoolDetailsDto>>> GetAll()
        {
            var schools = await _schoolService.GetAllSchoolsAsync();
            var result = schools.Select(SchoolMapper.ToDetailsDto).ToList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SchoolDetailsDto>> GetById(int id)
        {
            var school = await _schoolService.GetSchoolByIdAsync(id);
            return Ok(SchoolMapper.ToDetailsDto(school));
        }

        [HttpPost]
        public async Task<ActionResult<SchoolDetailsDto>> Create(
            [FromBody] CreateSchoolRequestDto request)
        {
            var school = await _schoolService.CreateSchoolAsync(
                request.Name,
                request.CreatedByUserId,
                request.AdminUserIds
            );

            var dto = SchoolMapper.ToDetailsDto(school);

            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<SchoolDetailsDto>> UpdateSchoolName(
            int id,
            [FromBody] UpdateSchoolDetailsRequestDto request)
        {
            var school = await _schoolService.UpdateSchoolAsync(id, request.SchoolName);
            var existingAdminIds = school.SchoolAdmins.Select(a => a.UserId).ToList();

            var adminsToAdd = request.AdminUserIds.Except(existingAdminIds);
            if (adminsToAdd.Any())
            {
                await _schoolService.AddSchoolAdminsAsync(id, adminsToAdd);
            }

            var adminsToRemove = existingAdminIds.Except(request.AdminUserIds);
            if (adminsToRemove.Any())
            {
                await _schoolService.RemoveSchoolAdminsAsync(id, adminsToRemove);
            }

            return Ok(SchoolMapper.ToDetailsDto(school));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _schoolService.DeleteSchoolAsync(id);
            return NoContent();
        }
    }
}
