namespace OwlFactory.Lantern.Api.Models;

public class Friendship : IBaseEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required User UserA { get; set; }
    public required User UserB { get; set; }
}
