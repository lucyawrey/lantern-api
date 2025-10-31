namespace OwlFactory.Lantern.Api.Models;

public class Content : IBaseEntity, INamedEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public required ContentType ContentType { get; set; }
    public AccessType HasReadAccess { get; set; } = AccessType.InviteOnly;
    public AccessType HasWriteAccess { get; set; } = AccessType.InviteOnly;
    public List<string> IndexKeys { get; set; } = [];
    public List<string> Indexes { get; set; } = [];
    public string Data { get; set; } = string.Empty;
    public ContentRenderer? ContentRenderer { get; set; }
}
