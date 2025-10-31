namespace OwlFactory.Lantern.Api.Models;

public class User : IBaseEntity, INamedEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public List<UserGroup> Groups { get; set; } = [UserGroup.User];
    /// <summary>
    /// The user's hashed password. This is very sensitive information and should never be sent to the client.
    /// </summary>
    public required string PasswordHash { get; set; }
    /// <summary>
    /// The user's account recovery code. This is very sensitive information and should never be sent to the client.
    /// </summary>
    public string? RecoveryCode { get; set; }
    public string? IconUrl { get; set; }
}

public enum UserGroup
{
    User = 0, Organization = 1, Admin = 2
}
