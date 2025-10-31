using IdGen;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OwlFactory.Lantern.Api.Models;

public class LanternDbContext : DbContext
{
    public DbSet<Content> Content { get; set; }
    public DbSet<ContentRenderer> ContentRenderer { get; set; }
    public DbSet<ContentType> ContentType { get; set; }
    public DbSet<Friendship> Friendship { get; set; }
    public DbSet<Ruleset> Ruleset { get; set; }
    public DbSet<Session> Session { get; set; }
    public DbSet<Table> Table { get; set; }
    public DbSet<TableMembership> TableMembership { get; set; }
    public DbSet<User> User { get; set; }

    private string _dbPath;
    private readonly IIdGenerator<long> _idGen;

    public LanternDbContext(IIdGenerator<long> idGen)
    {
        _dbPath = Path.Join(Environment.CurrentDirectory, "lantern.db");
        Console.WriteLine("SQLite database path: " + _dbPath);

        _idGen = idGen;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={_dbPath}");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var entityTypes = modelBuilder.Model.GetEntityTypes().Where(t => t.ClrType.IsAssignableTo(typeof(IBaseEntity)));
        foreach (var entityType in entityTypes)
        {
            modelBuilder.Entity(entityType.ClrType)
                .Property("UpdatedAt")
                .HasDefaultValueSql("unixepoch()")
                .HasConversion<DateTimeUnixEpochSecondsConverter>()
                .ValueGeneratedOnAddOrUpdate();
        }
        modelBuilder.Entity<ContentType>()
            .ComplexProperty(c => c.Schema, d => d.ToJson());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity is IBaseEntity entity)
                {
                    entity.Id = _idGen.CreateId();
                }
            }
            if (entry.State == EntityState.Modified)
            {
                if (entry.Entity is IBaseEntity entity)
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

public interface IBaseEntity
{
    long Id { get; set; }
    DateTime UpdatedAt { get; set; }
    // TODO more efficient way to get CreatedAt from Id
    virtual DateTime CreatedAt => new IdGenerator(1, new IdGeneratorOptions(new IdStructure(41, 10, 12), new DefaultTimeSource(DateTime.UnixEpoch, TimeSpan.FromSeconds(1)))).FromId(Id).DateTimeOffset.UtcDateTime;
}

public interface INamedEntity
{
    string Name { get; set; }
    string DisplayName { get; set; }
}


public interface IOwnedEntity
{
    User Owner { get; set; }
    AccessType HasReadAccess { get; set; }
    AccessType HasWriteAccess { get; set; }
}
