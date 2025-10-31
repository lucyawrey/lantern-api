namespace OwlFactory.Lantern.Api.Models;

public class NewRuleset
{
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required string OwnerRef { get; set; }
    public AccessType? HasReadAccess { get; set; }
    public AccessType? HasWriteAccess { get; set; }
}
