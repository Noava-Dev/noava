using noava.Models;
using noava.Models.Enums;

namespace noava.Data.Seeders
{
    public class AdminSeeder
    {
        public static void BootstrapAdmins(NoavaDbContext context, string clerkId)
        {
            var adminExists = context.Users.Any(u => u.Role == UserRole.ADMIN);

            if (adminExists)
                return;

            if (string.IsNullOrEmpty(clerkId))
                return;

            context.Users.Add(new User
            {
                ClerkId = clerkId,
                Role = UserRole.ADMIN,
            });

            context.SaveChanges();
        }
    }

}

