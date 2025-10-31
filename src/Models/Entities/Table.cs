namespace OwlFactory.Lantern.Api.Models;

public class Table : IBaseEntity, INamedEntity, IOwnedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required User Owner { get; set; }
    public AccessType HasReadAccess { get; set; } = AccessType.InviteOnly;
    public AccessType HasWriteAccess { get; set; } = AccessType.InviteOnly;
}
