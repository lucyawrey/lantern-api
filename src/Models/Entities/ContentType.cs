namespace OwlFactory.Lantern.Api.Models;

public class ContentType : IBaseEntity, ILibraryEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required User Owner { get; set; }
    public Visibility Visibility { get; set; } = Visibility.Private;
    public required Ruleset Ruleset { get; set; }
    // public Layout? DefaultLayout { get; set; } TODO fix relationships
    public List<string> DataIndexKeys { get; set; } = new List<string>();
    public Dictionary<string, ContentTypeSchemaType> DataSchema { get; set; } = new Dictionary<string, ContentTypeSchemaType>();
}
