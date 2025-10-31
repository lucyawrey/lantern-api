using OwlFactory.Lantern.Api.Models;

namespace OwlFactory.Lantern.Api.Utilities;

public static class DatabaseMigrator
{
    public static void Run(LanternDbContext db)
    {
        // TODO proper migrations
        db.Database.EnsureCreated();
        if (!db.User.Any(u => u.Name == "admin"))
        {
            var user = new User
            {
                Name = "admin",
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
