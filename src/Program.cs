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

app.MapPost("/content", async () =>
{
    var content = new Content
    {
        Name = "Fireball",
        Owner = db.User.Where(u => u.Name == "admin").First(),
        DataIndexes = [],
        DataIndexKeys = [],
        Data = new Dictionary<string, string>(),
    };
    db.Content.Add(content);
    await db.SaveChangesAsync();
    return "Added new content!";
})
.WithName("NewTest")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
