using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Classrooms;
﻿using Microsoft.AspNetCore.Mvc;
using noava.DTOs.Schools;
using noava.Services.Classrooms;
using noava.Services.Schools;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Controllers.Schools
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolsController : ControllerBase
    {
        private readonly ISchoolService _schoolService;
        private readonly IClassroomService _classroomService;
        private readonly IUserService _userService;

        private string GetCurrentUserId()
        {
            return User.FindFirstValue("sub")
                   ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new UnauthorizedAccessException("User ID not found");
        }

        public SchoolsController(ISchoolService schoolService, IClassroomService classroomService, IUserService userService)
        {
            _schoolService = schoolService;
            _classroomService = classroomService;
            _userService = userService;
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
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateSchool([FromBody] SchoolRequestDto request)
        {
            try
            {
                var createdByUserId = _userService.GetUserId(User);
                if (createdByUserId == null)
                    return Unauthorized();
                
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
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateSchool(int id, [FromBody] SchoolRequestDto request)
        {
            await _schoolService.UpdateSchoolAsync(id, request);
            return Ok();
        }


        [HttpDelete("{id:int}")]
        [Authorize(Roles = "ADMIN")]
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

        [HttpDelete("{id:int}/admins/{clerkId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> RemoveSchoolAdmin(int id, string clerkId)
        {
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

        //CLASSROOMS
        [HttpGet("{id:int}/classrooms")]
        public async Task<ActionResult<List<SchoolClassroomResponseDto>>> GetClassrooms(int id)
        {
            try
            {
                var classrooms = await _schoolService.GetClassroomsForSchoolAsync(id);
                return Ok(classrooms);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{id:int}/classrooms")]
        public async Task<IActionResult> CreateClassroom(int id, [FromBody] ClassroomRequestDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var school = await _schoolService.GetSchoolByIdAsync(id);
                if (school == null) return NotFound();

                bool isSiteAdmin = User.IsInRole("ADMIN");
                bool isSchoolAdmin = school.Admins.Any(a => a.ClerkId == userId);

                if (!isSiteAdmin && !isSchoolAdmin)
                {
                    return Forbid("You do not have permission to add classrooms to this school.");
                }

                request.SchoolId = id;
                await _classroomService.CreateAsync(request, userId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }
}
