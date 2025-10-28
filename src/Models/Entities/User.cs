namespace OwlFactory.Lantern.Api.Models;

public class User : IBaseEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required string Username { get; set; }
    public List<UserGroup> Groups { get; set; } = [UserGroup.User];
    public string? DisplayName { get; set; }
    public string? IconUrl { get; set; }
    public string? Email { get; set; }
    public bool EmailIsVerified { get; set; } = false;
    /// <summary>
    /// The user's hashed password. This is very sensitive information and should never be sent to the client.
    /// </summary>
    public required string PasswordHash { get; set; }
    /// <summary>
    /// The user's account recovery code. This is very sensitive information and should never be sent to the client.
    /// </summary>
    public string? RecoveryCode { get; set; }
}
