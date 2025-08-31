using IdGen;
using Swashbuckle.AspNetCore.SwaggerUI;

var builder = WebApplication.CreateBuilder(args);

var idGenerator = new IdGenerator(0);
var db = new LanternContext(idGenerator);
db.Database.EnsureCreated();
if (!db.User.Any(u => u.Name == "admin"))
{
    var user = new User
    {
        Name = "admin",
        DisplayName = "Lantern Administrator",
        Groups = [UserGroup.Admin],
        PasswordHash = "TODOPASSWORDHASHING",
    };
    db.User.Add(user);
    await db.SaveChangesAsync();
    Console.WriteLine("Default user: admin");
}

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () =>
{
    return "Lantern API";
});

app.MapPost("/content", async (NewContent content) =>
{
    var owner = db.User.Find(content.OwnerId);
    var contentType = db.User.Find(content.OwnerId);
    if (owner == null)
    {
        return "Error!";
    }
    db.Content.Add(new Content
    {
        Name = content.Name,
        Owner = owner,
        Visibility = content.Visibility ?? default,
        IsDynamic = content.IsDynamic ?? default,
        ContentTypeId = content.ContentTypeId
    LayoutId { get; set;
    }
    Ruleset { get; set; }
    DataIndexes { get; set; }
    DataIndexKeys { get; set; }
    Data { get; set; }
});
await db.SaveChangesAsync();
return "Added new content!";
})
.WithName("NewTest")
.WithOpenApi();

app.Run();
