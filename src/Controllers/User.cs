using Microsoft.AspNetCore.Mvc;
using OwlFactory.Lantern.Api.Models;

namespace LanternApi.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly LanternDbContext _db;

        public UserController(LanternDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        [Route("sign-up")]
        public async Task<ActionResult<string>> SignUp(NewContent content)
        {
            return "TODO Implement user sign up.";
        }
    }
}
