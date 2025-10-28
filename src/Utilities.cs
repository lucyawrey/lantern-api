using OwlFactory.Lantern.Api.Models;

namespace OwlFactory.Lantern.Api.Utilities;

public static class Utilities
{
    public static void MigrateDatabase(LanternDbContext db)
    {
        // TODO proper migrations
        db.Database.EnsureCreated();
        if (!db.User.Any(u => u.Username == "admin"))
        {
            var user = new User
            {
                Username = "admin",
                DisplayName = "Lantern Administrator",
                Groups = [UserGroup.Admin],
                PasswordHash = "TODOPASSWORDHASHING",
            };
            db.User.Add(user);
            db.SaveChanges();
            Console.WriteLine("Created default user: admin");
        }
    }
}
