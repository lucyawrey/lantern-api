using Microsoft.AspNetCore.Mvc;
using OwlFactory.Lantern.Api.Models;

namespace LanternApi.Controllers
{
    [ApiController]
    [Route("content")]
    public class ContentController : ControllerBase
    {
        private readonly LanternDbContext _db;

        public ContentController(LanternDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        [Route("create")]
        public async Task<ActionResult<string>> CreateContent(NewContent content)
        {
            var owner = _db.User.Find(content.OwnerId);
            var contentType = _db.ContentType.Find(content.ContentTypeId);
            var layout = _db.ContentRenderer.Find(content.LayoutId);
            var ruleset = _db.Ruleset.Find(content.Ruleset);
            if (owner == null)
            {
                return "Error!";
            }
            // TODO populate data indexes from DataIndexKeys and Data
            // TODO convert between any JSON object and a flat Data object in C sharp and the Database
            _db.Content.Add(new Content
            {
                Name = content.Name,
                Owner = owner,
                Visibility = content.Visibility ?? default,
                IsDynamic = content.IsDynamic ?? default,
                ContentType = contentType,
                Layout = layout,
                Ruleset = ruleset,
                DataIndexKeys = new List<string>(),
                Data = new Dictionary<string, string>(),
            });
            await _db.SaveChangesAsync();
            return "Added new content.";
        }
    }
}

public class NewContent
{
    public required string Name { get; set; }
    public required long OwnerId { get; set; }
    public Visibility? Visibility { get; set; }
    public bool? IsDynamic { get; set; }
    public long? ContentTypeId { get; set; }
    public long? LayoutId { get; set; }
    public long? Ruleset { get; set; }
    public List<string>? DataIndexKeys { get; set; }
    public Dictionary<string, string>? Data { get; set; }
}
