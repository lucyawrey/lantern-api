using System.ComponentModel.DataAnnotations.Schema;

namespace OwlFactory.Lantern.Api.Models;

public class ContentType : IBaseEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public AccessType HasReadAccess { get; set; } = AccessType.InviteOnly;
    public AccessType HasWriteAccess { get; set; } = AccessType.InviteOnly;
    public required Ruleset Ruleset { get; set; }
    public ContentMode ContentMode { get; set; } = ContentMode.Prop;
    public ContentCategory ContentCategory { get; set; } = ContentCategory.Page;
    public List<string> IndexKeys { get; set; } = new List<string>();
    public Schema Schema { get; set; } = new Schema();
    [ForeignKey(nameof(ContentRenderer))]
    public ContentRenderer? DefaultContentRenderer { get; set; }
}

public enum ContentMode
{
    Prop = 0, Actor = 1, ActorTemplate = 2
}

public enum ContentCategory
{
    Page = 0, Asset = 1, Character = 2
}

public enum SchemaPropertyType
{
    AnyValue = 0, String = 1, Number = 2, Boolean = 3, Object = 4, Array = 5, LocalType = 6, ContentType = 7
}

public class Schema
{
    public bool IsDynamic { get; set; } = true;
    public List<SchemaPropertyDefinition> Properties { get; set; } = new List<SchemaPropertyDefinition>();
    public List<SchemaTypeDefinition> Types { get; set; } = new List<SchemaTypeDefinition>();
}

public class SchemaTypeDefinition
{
    public required string Key { get; set; }
    public List<SchemaPropertyDefinition> Properties { get; set; } = new List<SchemaPropertyDefinition>();
}

public class SchemaPropertyDefinition
{
    public required string Key { get; set; }
    public required SchemaPropertyType Type { get; set; }
    public SchemaPropertyDefinition? ArrayItemDefinition { get; set; }
    public long? ContentTypeId { get; set; }
    public string? LocalTypeKey { get; set; }
}
