using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDb>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapGet("/api/clients", async (AppDb db, string group) => 
    await db.Clients
        .Where(c => c.GroupName == group)
        .Select(c => new {
            c.FirstName,
            c.LastName,
            c.Mobile,
            c.Balance
        }).ToListAsync());

app.MapPost("/api/sms", async (AppDb db, SmsRequest request) => 
{
    // SMS Gateway Integration Here
    return Results.Ok();
});

app.Run();

// Database Context
class AppDb : DbContext {
    public DbSet<Client> Clients { get; set; }
    public AppDb(DbContextOptions<AppDb> options) : base(options) {}
}

// Client Model (Match your SQL Server Table)
class Client {
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Mobile { get; set; }
    public decimal Balance { get; set; }
    public string GroupName { get; set; }
}

// SMS Request Model
record SmsRequest(string Mobile, decimal Balance);
