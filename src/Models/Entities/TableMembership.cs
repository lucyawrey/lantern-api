namespace OwlFactory.Lantern.Api.Models;

public class TableMembership : IBaseEntity
{
    public long Id { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public required Table Table { get; set; }
    public required User User { get; set; }
}
