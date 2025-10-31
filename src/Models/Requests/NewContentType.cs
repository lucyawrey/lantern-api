namespace OwlFactory.Lantern.Api.Models;

public class NewContentType
{
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public required string OwnerRef { get; set; }
    public AccessType? HasReadAccess { get; set; }
    public AccessType? HasWriteAccess { get; set; }
    public required string RulesetRef { get; set; }
    public ContentMode? ContentMode { get; set; }
    public ContentCategory? ContentCategory { get; set; }
    public List<string>? IndexKeys { get; set; }
    public bool? HasDynamicSchema { get; set; }
    public Schema? Schema { get; set; }
    public string? DefaultContentRendererRef { get; set; }
}
