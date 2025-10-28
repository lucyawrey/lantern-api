using IdGen;
using OwlFactory.Lantern.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

var idGenerator = new IdGenerator(0);
var db = new LanternDbContext(idGenerator);
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
    var contentType = db.ContentType.Find(content.ContentTypeId);
    var layout = db.Layout.Find(content.LayoutId);
    var ruleset = db.Ruleset.Find(content.Ruleset);
    if (owner == null)
    {
        return "Error!";
    }
    // TODO populate data indexes from DataIndexKeys and Data
    // TODO convert between any JSON object and a flat Data object in C sharp and the Database
    db.Content.Add(new Content
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
    await db.SaveChangesAsync();
    return "Added new content.";
})
.WithName("Add Content")
.WithOpenApi();

app.Run();
