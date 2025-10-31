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
        var data = Toml.ToModel<InitialData>(toml);
    }
}
