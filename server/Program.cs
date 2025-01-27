using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<DatabaseHelper>();
// Настройка сервисов
builder.Services.AddDbContext<MasterDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MasterDb")));

// Регистрация IHttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Регистрация ApplicationDbContext с поддержкой динамического подключения
builder.Services.AddScoped<ApplicationDbContext>((serviceProvider) =>
{
    var httpContextAccessor = serviceProvider.GetService<IHttpContextAccessor>();
    var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;

    if (userIdClaim != null && int.TryParse(userIdClaim, out var userId))
    {
        var masterDbContext = serviceProvider.GetRequiredService<MasterDbContext>();
        var userDatabase = masterDbContext.UserDatabases.FirstOrDefault(ud => ud.UserId == userId);

        if (userDatabase != null)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(userDatabase.ConnectionString);
            return new ApplicationDbContext(optionsBuilder.Options, userDatabase.ConnectionString);
        }
    }

    throw new InvalidOperationException("Не удалось определить базу данных пользователя.");
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; // Убираем циклы
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase; // camelCase
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FluxÆther API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Адрес фронтенда
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Настройка JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("5f4dcc3b5aa765d61d8327deb882cf99")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// Инициализация базы данных
using (var scope = app.Services.CreateScope())
{
    var masterContext = scope.ServiceProvider.GetRequiredService<MasterDbContext>();
    masterContext.Database.Migrate();

    // Добавление администратора, если отсутствует
    if (!masterContext.UserWebs.Any())
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword("5f4dcc3b5aa765d61d8327deb882cf99");
        masterContext.UserWebs.Add(new UserWeb
        {
            Username = "admin",
            PasswordHash = hashedPassword
        });
        masterContext.SaveChanges();
    }

    // Миграции для пользовательских баз данных
    var userDatabases = masterContext.UserDatabases.ToList();
    foreach (var userDb in userDatabases)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(userDb.ConnectionString);

        using (var userDbContext = new ApplicationDbContext(optionsBuilder.Options, userDb.ConnectionString))
        {
            userDbContext.Database.Migrate();
        }
    }
}

// Настройки Middleware
app.UseCors("AllowMyOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FluxÆther API v1"));
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();