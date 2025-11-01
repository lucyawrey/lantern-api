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
            // var owner = _db.User.Find(content.OwnerId);
            // var contentType = _db.ContentType.Find(content.ContentTypeId);
            // var layout = _db.ContentRenderer.Find(content.LayoutId);
            // var ruleset = _db.Ruleset.Find(content.Ruleset);
            // if (owner == null)
            // {
            //     return "Error!";
            // }
            // TODO populate data indexes from IndexKeys and Data
            // TODO convert between any JSON object and a flat Data object in C sharp and the Database
            // _db.Content.Add(new Content
            // {
            //     Name = content.Name,
            //     DisplayName = content.Name,
            //     Owner = owner,
            //     HasReadAccess = content.HasReadAccess ?? default,
            //     ContentType = contentType ?? 1,
            //     Layout = layout,
            //     Ruleset = ruleset,
            //     IndexKeys = new List<string>(),
            //     Data = new Dictionary<string, string>(),
            // });
            //await _db.SaveChangesAsync();
            //return "Added new content.";
            return "TODO implement create content.";
        }
    }
}
