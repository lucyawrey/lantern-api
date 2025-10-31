using System.ComponentModel.DataAnnotations.Schema;

namespace OwlFactory.Lantern.Api.Models;

public class ContentType : IBaseEntity, INamedEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public AccessType HasReadAccess { get; set; } = AccessType.InviteOnly;
    public AccessType HasWriteAccess { get; set; } = AccessType.InviteOnly;
    public required Ruleset Ruleset { get; set; }
    public ContentMode ContentMode { get; set; } = ContentMode.Static;
    public ContentCategory ContentCategory { get; set; } = ContentCategory.Other;
    public List<string> IndexKeys { get; set; } = [];
    public bool HasDynamicSchema { get; set; } = true;
    public Schema Schema { get; set; } = new();
    [ForeignKey(nameof(ContentRenderer))]
    public ContentRenderer? DefaultContentRenderer { get; set; }
}

public enum ContentMode
{
    Static = 0, Interactive = 1
}

public enum ContentCategory
{
    Other = 0, Page = 1, Character = 2, Item = 3, NPC = 4, Container = 5
}

public enum SchemaPropertyType
{
    AnyValue = 0, String = 1, Number = 2, Boolean = 3, Object = 4, Array = 5, LocalType = 6, ContentType = 7
}

public class Schema
{
    public List<SchemaPropertyDefinition> Properties { get; set; } = [];
    public List<SchemaTypeDefinition> Types { get; set; } = [];
}

public class SchemaTypeDefinition
{
    public required string Key { get; set; }
    public List<SchemaPropertyDefinition> Properties { get; set; } = [];
}

public class SchemaPropertyDefinition
{
    public required string Key { get; set; }
    public required SchemaPropertyType Type { get; set; }
    public SchemaPropertyDefinition? ArrayItemDefinition { get; set; }
    public long? ContentTypeId { get; set; }
    public string? LocalTypeKey { get; set; }
}
