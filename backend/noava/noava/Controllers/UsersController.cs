using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Models.Enums;
using System.Security.Claims;

namespace noava.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NoavaDbContext _db;

        public UsersController(NoavaDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpPost("sync")]
        public async Task<IActionResult> SyncUser()
        {
            var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                          User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(clerkId))
                return Unauthorized("No ClerkId found in token.");

            var user = await _db.Users.SingleOrDefaultAsync(u => u.ClerkId == clerkId);

            if (user == null)
            {
                user = new User
                {
                    ClerkId = clerkId,
                    Role = UserRole.USER
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }

            return Ok(new
            {
                user.ClerkId,
                Role = user.Role.ToString()
            });
        }
    }
}
