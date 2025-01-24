using Microsoft.AspNetCore.Authentication.JwtBearer;
using CRMsystem.Data;
using CRMsystem.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using CRMsystem.Models; // Импорт модели UserWeb
using BCrypt.Net; // Для работы с хэшированием

var builder = WebApplication.CreateBuilder(args);

// Настройка сервисов
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавление SignalR
builder.Services.AddSignalR();

// Настройка контроллеров
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; // Убираем циклы
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase; // camelCase
    });

// Добавление Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FluxÆther API", Version = "v1" });
});

// Настройка аутентификации через JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("123")), // Секретный ключ для JWT
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Добавление политики CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Адрес фронтенда
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Конфигурация приложения
var app = builder.Build();

// Инициализация базы данных
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Если пользователь отсутствует, создаём его
    if (!context.UserWebs.Any())
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123"); // Пароль "123"
        context.UserWebs.Add(new UserWeb
        {
            Username = "admin", // Логин "admin"
            PasswordHash = hashedPassword
        });
        context.SaveChanges();
    }
}

// Применение политики CORS
app.UseCors("AllowMyOrigin");

// Обработка ошибок и Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FluxÆther API v1"));
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseStatusCodePagesWithRedirects("/Home/Error/{0}");
}

// Перенаправление HTTP на HTTPS
app.UseHttpsRedirection();

// Подключение статических файлов
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"C:\1\Тест\client\build"), // Указываем путь к build клиента
    RequestPath = "" // Устанавливаем корневой путь
});

// Настройка аутентификации и авторизации
app.UseAuthentication();
app.UseAuthorization();

// Настройка маршрутов
app.UseRouting();
app.MapControllers();
app.MapHub<OrderHub>("/orderHub");
app.MapFallbackToFile("/index.html"); // Роут для фронтенда

// Запуск приложения
app.Run();
