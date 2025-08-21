using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DbSet<Content> Content { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Credential> Credential { get; set; }
    public DbSet<Session> Session { get; set; }

    public string DbPath { get; }

    public DataContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = Path.Join(path, "lantern_data.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}

public class Content
{
    public long Id { get; set; }
    public string? Name { get; set; }
}

public class User
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class Credential
{
    public long Id { get; set; }
    public string? PasswordHash { get; set; }
    // UserId
}

public class Session
{
    public string? Id { get; set; }
    // ExpiresAt
    // UserId
}
