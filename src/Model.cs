using System.Data;
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

    // The following configures EF to create a Sqlite database file in the"local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}

public class Content
{
    public long Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Visibility Visibility { get; set; }
    public bool IsDynamic { get; set; }
    public ContentType ContentType { get; set; }
    public Layout Layout { get; set; }
    public User Owner { get; set; }
    public Ruleset Ruleset { get; set; }
    public string[] DataIndexes { get; set; }
    public string[] DataIndexKeys { get; set; }
    public Dictionary<string, string> Data { get; set; }
}

public class ContentType
{
    public long Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Visibility Visibility { get; set; }
    public Layout DefaultLayout { get; set; }
    public User Owner { get; set; }
    public Ruleset Ruleset { get; set; }
    public string[] DataIndexKeys { get; set; }
    public Dictionary<string, string> DataSchema { get; set; }
}

public class Layout
{
    public long Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Visibility Visibility { get; set; }
    public User Owner { get; set; }
    public ContentType ContentType { get; set; }
    public string Css { get; set; }
    public string Html { get; set; }
}

public class Ruleset
{
    public long Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Visibility Visibility { get; set; }
    public User Owner { get; set; }
}

public class User
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

public class Credential
{
    public long Id { get; set; }
    public string PasswordHash { get; set; }
    // UserId
}

public class Session
{
    public string Id { get; set; }
    // ExpiresAt
    // UserId
}

public enum UserGroup
{
    User, Admin
}

public enum Visibility
{
    Private, Limited, Friends, Public
}
