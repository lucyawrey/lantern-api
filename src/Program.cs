using IdGen;
using IdGen.DependencyInjection;
using OwlFactory.Lantern.Api.Models;
using OwlFactory.Lantern.Api.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddIdGen(0, () => new IdGeneratorOptions(
    new IdStructure(41, 10, 12),
    new DefaultTimeSource(DateTime.UnixEpoch, TimeSpan.FromSeconds(1))
));
builder.Services.AddDbContext<LanternDbContext>();
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LanternDbContext>();
    DatabaseMigrator.Run(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.MapControllers();

app.MapGet("/", () =>
{
    if (app.Environment.IsDevelopment())
    {
        var html = """<!doctype html><title>Lantern API Reference</title><meta charset=utf-8><meta content="width=device-width,initial-scale=1"name=viewport><div id=app></div><script src=https://cdn.jsdelivr.net/npm/@scalar/api-reference></script><script>Scalar.createApiReference("#app",{url:"http://localhost:5092/openapi/v1.json"})</script>""";
        return Results.Content(html, "text/html");
    }
    return Results.Content("Lantern API", "text/html");
}).ExcludeFromDescription();

app.Run();
