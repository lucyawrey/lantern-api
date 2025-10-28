namespace OwlFactory.Lantern.Api.Models;

public class ContentRenderer : IBaseEntity, ILibraryEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required User Owner { get; set; }
    public Visibility Visibility { get; set; } = Visibility.Private;
    public LayoutType Type { get; set; } = LayoutType.Content;
    public required ContentType ContentType { get; set; }
    public string? Css { get; set; }
    public string? Html { get; set; }
}
