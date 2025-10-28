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
    public bool IsDynamicallyTyped { get; set; } = true;
    public ContentCategory ContentCategory { get; set; }
    public ContentRenderer? DefaultContentRenderer { get; set; }
    public List<string> IndexKeys { get; set; } = new List<string>();
    public Schema? Schema { get; set; } = new Schema();
}
