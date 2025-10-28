namespace OwlFactory.Lantern.Api.Models;

public class ContentType : IBaseEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public Visibility Visibility { get; set; } = Visibility.Private;
    public required Ruleset Ruleset { get; set; }
    // public Layout? DefaultLayout { get; set; } TODO fix relationships
    public List<string> DataIndexKeys { get; set; } = new List<string>();
    public DataSchema DataSchema { get; set; } = new DataSchema();
}

public class DataSchema
{
    public Dictionary<string, SchemaProperty> Properties { get; set; } = new Dictionary<string, SchemaProperty>();
    public Dictionary<string, Dictionary<string, SchemaProperty>> Types = new Dictionary<string, Dictionary<string, SchemaProperty>>();
}

public interface SchemaProperty
{
    SchemaPropertyType Type { get; }
}

public enum SchemaPropertyType
{
    AnyValue = 0, String = 1, Number = 2, Boolean = 3, Object = 4, Array = 5, LocalType = 6, ContentType = 7
}

public class AnyValueProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.AnyValue;
}

public class StringProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.String;
}

public class NumberProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.Number;
}

public class BooleanProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.Boolean;
}

public class ObjectProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.Object;
}

public class ArrayProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.Array;
    public SchemaPropertyType ItemType { get; set; } = SchemaPropertyType.AnyValue;
}

public class LocalTypeProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.LocalType;
    public required string LocalTypeName { get; set; }
}

public class ContentTypeProperty : SchemaProperty
{
    public SchemaPropertyType Type => SchemaPropertyType.ContentType;
    public required long ContentTypeId { get; set; }
}
