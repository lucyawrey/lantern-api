namespace OwlFactory.Lantern.Api.Models;

public class NewUser
{
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public List<UserRole>? Roles { get; set; }
    public string? IconUrl { get; set; }
}
