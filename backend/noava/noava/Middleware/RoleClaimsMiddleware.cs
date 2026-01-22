using noava.Data;
using System;
using System.Security.Claims;

public class RoleClaimsMiddleware
{
    private readonly RequestDelegate _next;

    public RoleClaimsMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, NoavaDbContext db)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var clerkId = context.User.FindFirst("sub")?.Value;

            if (clerkId != null)
            {
                var user = await db.Users.FindAsync(clerkId);
                if (user != null)
                {
                    var claimsIdentity = context.User.Identity as ClaimsIdentity;
                    if (claimsIdentity != null &&
                        !claimsIdentity.HasClaim(c => c.Type == ClaimTypes.Role))
                    {
                        claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, user.Role.ToString()));
                    }
                }
            }
        }

        await _next(context);
    }
}
