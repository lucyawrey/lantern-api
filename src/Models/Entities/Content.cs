namespace OwlFactory.Lantern.Api.Models;

public class Content : IBaseEntity, ILibraryEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required User Owner { get; set; }
    public Visibility Visibility { get; set; } = Visibility.Private;
    public bool IsDynamic { get; set; } = false;
    public ContentType? ContentType { get; set; }
    public ContentRenderer? Layout { get; set; }
    public Ruleset? Ruleset { get; set; }
    public List<string> DataIndexes { get; set; } = new List<string>();
    public List<string> DataIndexKeys { get; set; } = new List<string>();
    public Dictionary<string, string> Data { get; set; } = new Dictionary<string, string>();
}
