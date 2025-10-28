using System.ComponentModel.DataAnnotations.Schema;

public enum AccessType
{
    InviteOnly = 0, Friends = 1, Tables = 2, FriendsAndTables = 3, Public = 4, Members = 5
}

public enum UserGroup
{
    User = 0, Organization = 1, Admin = 2
}

public enum ContentCategory
{
    Character, Actor, CharacterTemplate, ActorTemplate, Item, Page
}

public class Schema
{
    [NotMapped]
    public Dictionary<string, SchemaProperty> Properties { get; set; } = new Dictionary<string, SchemaProperty>();
    [NotMapped]
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
