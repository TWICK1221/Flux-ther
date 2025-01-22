// Путь к файлу: CRMsystem/Program.cs

using CRMsystem.Data;
using CRMsystem.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Настройка сервисов
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; // Убираем циклы
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase; // camelCase
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FluxÆther API", Version = "v1" });
});

// Добавление CORS политики
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Убедитесь, что указан правильный адрес фронтенда
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Конфигурация приложения
var app = builder.Build();

// Применение CORS политики
app.UseCors("AllowMyOrigin");

// Обработка ошибок и Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FluxÆther API v1"));
}
else
{
    // Обработка ошибок для продакшена
    app.UseExceptionHandler("/Home/Error");
    app.UseStatusCodePagesWithRedirects("/Home/Error/{0}");
}

// Перенаправление HTTP на HTTPS
app.UseHttpsRedirection();

// Настройка маршрутизации
app.UseRouting();
app.UseAuthorization();

// Подключение контроллеров
app.MapControllers();

// Подключение SignalR хаба
app.MapHub<OrderHub>("/orderHub");

// Запуск приложения
app.Run();
