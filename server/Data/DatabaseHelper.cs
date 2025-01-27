using Microsoft.EntityFrameworkCore;
using FluxÆther.Data;

public class DatabaseHelper
{
    /// <summary>
    /// Применение миграций к базе данных.
    /// </summary>
    /// <param name="connectionString">Строка подключения к базе данных.</param>
    public void ApplyMigrations(string connectionString)
    {
        try
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            // Создание экземпляра ApplicationDbContext с передачей строки подключения
            using var context = new ApplicationDbContext(optionsBuilder.Options, connectionString);
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при применении миграций: {ex.Message}");
            throw;
        }
    }
}