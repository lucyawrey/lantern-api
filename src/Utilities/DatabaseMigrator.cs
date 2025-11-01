using OwlFactory.Lantern.Api.Models;
using Tomlyn;

namespace OwlFactory.Lantern.Api.Utilities;

public static class DatabaseMigrator
{
    public static void Run(LanternDbContext db)
    {
        // TODO proper migrations
        db.Database.EnsureCreated();
        if (!db.User.Any())
        {
            ImportInitialData(db);
        }
    }

    private static void ImportInitialData(LanternDbContext db)
    {
        using StreamReader reader = new("initial-data.toml");
        string toml = reader.ReadToEnd();
        var data = Toml.ToModel<InitialData>(toml, null, new TomlModelOptions
        {
            ConvertPropertyName = x => x
        });
        // Users
        if (data.User != null)
        {
            foreach (var user in data.User)
            {
                var newUser = new User
                {
                    Name = user.Name,
                    DisplayName = user.DisplayName,
                    Roles = user.Roles ?? [UserRole.User],
                    PasswordHash = "TODO_GENERATE_PASSWORD_HASH",
                };
                db.User.Add(newUser);
            }
        }
        db.SaveChanges();
    }
}
