using IdGen;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OwlFactory.Lantern.Api.Entities;

public class LanternDbContext : DbContext
{
    public DbSet<Content> Content { get; set; }
    public DbSet<ContentType> ContentType { get; set; }
    public DbSet<Layout> Layout { get; set; }
    public DbSet<Ruleset> Ruleset { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Session> Session { get; set; }

    private string DbPath { get; }
    private IdGenerator Generator { get; }

    public LanternDbContext(IdGenerator generator)
    {
        DbPath = Path.Join(Environment.CurrentDirectory, "lantern.db");
        Console.WriteLine("Database path: " + DbPath);
        Generator = generator;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var entityTpes = modelBuilder.Model.GetEntityTypes().Where(t => t.ClrType.IsAssignableTo(typeof(BaseEntity)));
        foreach (var entityType in entityTpes)
        {
            modelBuilder.Entity(entityType.ClrType)
                .Property("UpdatedAt")
                .HasDefaultValueSql("unixepoch()")
                .HasConversion<DateTimeUnixEpochSecondsConverter>()
                .ValueGeneratedOnAddOrUpdate();
        }
        modelBuilder.Entity<Content>()
            .OwnsOne(e => e.Data, p =>
            {
                p.ToJson();
            });
        modelBuilder.Entity<ContentType>()
            .OwnsOne(e => e.DataSchema, p =>
            {
                p.ToJson();
            });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity is BaseEntity entity)
                {
                    entity.Id = Generator.CreateId();
                }
            }
            if (entry.State == EntityState.Modified)
            {
                if (entry.Entity is BaseEntity entity)
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
        return base.SaveChangesAsync();
    }
}

public class DateTimeUnixEpochSecondsConverter : ValueConverter<DateTime, long>
{
    public DateTimeUnixEpochSecondsConverter()
        : base(
            v => ((DateTimeOffset)v).ToUnixTimeSeconds(),
            v => DateTimeOffset.FromUnixTimeSeconds(v).UtcDateTime)
    {
    }
}

public abstract class BaseEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
}

public abstract class LibraryEntity : BaseEntity
{
    public required User Owner { get; set; }
    public Visibility Visibility { get; set; } = Visibility.Private;
}

public class Content : LibraryEntity
{
    public bool IsDynamic { get; set; } = false;
    public ContentType? ContentType { get; set; }
    public Layout? Layout { get; set; }
    public Ruleset? Ruleset { get; set; }
    public List<string> DataIndexes { get; set; } = new List<string>();
    public List<string> DataIndexKeys { get; set; } = new List<string>();
    public Dictionary<string, string> Data { get; set; } = new Dictionary<string, string>();
}

public class ContentType : LibraryEntity
{
    public required Ruleset Ruleset { get; set; }
    // public Layout? DefaultLayout { get; set; } TODO fix relationships
    public List<string> DataIndexKeys { get; set; } = new List<string>();
    public Dictionary<string, ContentTypeSchemaType> DataSchema { get; set; } = new Dictionary<string, ContentTypeSchemaType>();
}

public class Layout : LibraryEntity
{
    public LayoutType Type { get; set; } = LayoutType.Content;
    public required ContentType ContentType { get; set; }
    public string? Css { get; set; }
    public string? Html { get; set; }
}

public class Ruleset : LibraryEntity { }

public class User : BaseEntity
{
    public List<UserGroup> Groups { get; set; } = [UserGroup.User];
    public string? DisplayName { get; set; }
    public string? IconUrl { get; set; }
    public string? Email { get; set; }
    public bool EmailIsVerified { get; set; } = false;
    /// <summary>
    /// The user's hashed password. This is very sensitive information and should never be sent to a client.
    /// </summary>
    public required string PasswordHash { get; set; }
    /// <summary>
    /// The user's account recovery code. This is very sensitive information and should never be sent to a client.
    /// </summary>
    public string? RecoveryCode { get; set; }
}

public class Session
{
    public required string Id { get; set; }
    public required DateTime ExpiresAt { get; set; }
    public required User User { get; set; }
}

public enum Visibility
{
    Private = 0, Limited = 1, Friends = 2, Public = 3
}

public enum ContentTypeSchemaType
{
    String = 0, Number = 1, Boolean = 2
}

public enum LayoutType
{
    Content = 0, Character = 1,
}

public enum UserGroup
{
    User = 0, Organization = 1, Admin = 2
}

public class NewContent
{
    public required string Name { get; set; }
    public required long OwnerId { get; set; }
    public Visibility? Visibility { get; set; }
    public bool? IsDynamic { get; set; }
    public long? ContentTypeId { get; set; }
    public long? LayoutId { get; set; }
    public long? Ruleset { get; set; }
    public List<string>? DataIndexKeys { get; set; }
    public Dictionary<string, string>? Data { get; set; }
}
