using noava.Data;
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
            var clerkId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(clerkId))
            {
                var user = await db.Users.FindAsync(clerkId);

                if (user != null)
                {
                    var identity = new ClaimsIdentity(
                        context.User.Identity,
                        context.User.Claims,
                        context.User.Identity.AuthenticationType,
                        ClaimTypes.Name,
                        ClaimTypes.Role
                    );

                    if (!identity.HasClaim(c => c.Type == ClaimTypes.Role))
                    {
                        identity.AddClaim(
                            new Claim(ClaimTypes.Role, user.Role.ToString())
                        );
                    }
                    context.User = new ClaimsPrincipal(identity);
                }
            }
        }
        await _next(context);
    }
}