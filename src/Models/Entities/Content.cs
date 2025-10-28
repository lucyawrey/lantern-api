using System.ComponentModel.DataAnnotations.Schema;

namespace OwlFactory.Lantern.Api.Models;

public class Content : IBaseEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public required ContentType ContentType { get; set; }
    public AccessType HasReadAccess { get; set; } = AccessType.InviteOnly;
    public AccessType HasWriteAccess { get; set; } = AccessType.InviteOnly;
    public ContentRenderer? ContentRenderer { get; set; }
    public List<string> IndexKeys { get; set; } = new List<string>();
    public List<string> Indexes { get; set; } = new List<string>();
    public Dictionary<string, string> Data { get; set; } = new Dictionary<string, string>();
}
