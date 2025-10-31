namespace OwlFactory.Lantern.Api.Models;

public class InitialData
{
    public List<NewContent>? Content { get; set; }
    public List<NewContentType>? ContentType { get; set; }
    public List<NewRuleset>? Ruleset { get; set; }
    public List<NewUser>? User { get; set; }
}
