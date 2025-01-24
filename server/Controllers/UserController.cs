using System;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using FluxÆther.Data;
using Microsoft.EntityFrameworkCore;
using CRMsystem.Data;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly MasterDbContext _masterDbContext;

        public UserController(MasterDbContext masterDbContext)
        {
            _masterDbContext = masterDbContext ?? throw new ArgumentNullException(nameof(masterDbContext));
        }

        /// <summary>
        /// Создание новой базы данных для пользователя.
        /// </summary>
        /// <param name="request">Запрос с данными пользователя.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPost("create")]
        public IActionResult CreateUserDatabase([FromBody] CreateUserRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Неверный запрос." });
            }

            var dbName = $"UserDb_{request.UserId}";
            var connectionString = $"Server=(localdb)\\MSSQLLocalDB;Database={dbName};Trusted_Connection=True;MultipleActiveResultSets=true";

            try
            {
                // Лог создания базы данных
                Console.WriteLine($"Начинаем создание базы данных: {dbName}");

                // Создание новой базы данных
                using (var connection = new SqlConnection("Server=(localdb)\\MSSQLLocalDB;Trusted_Connection=True;"))
                {
                    connection.Open();
                    using var command = connection.CreateCommand();
                    command.CommandText = $"CREATE DATABASE [{dbName}]";
                    command.ExecuteNonQuery();
                }

                Console.WriteLine($"База данных {dbName} успешно создана.");

                // Применение миграций
                ApplyMigrations(connectionString);

                Console.WriteLine($"Миграции успешно применены к базе данных {dbName}.");

                // Сохранение информации о базе данных
                var userDatabase = new UserDatabase
                {
                    UserId = request.UserId,
                    DatabaseName = dbName,
                    ConnectionString = connectionString
                };

                _masterDbContext.UserDatabases.Add(userDatabase);
                _masterDbContext.SaveChanges();

                Console.WriteLine($"Информация о базе данных {dbName} сохранена в MasterDbContext.");

                return Ok(new { message = $"База данных для пользователя {request.UserId} успешно создана." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при создании базы данных: {ex.Message}");
                return StatusCode(500, new { message = "Ошибка при создании базы данных.", error = ex.Message });
            }
        }

        /// <summary>
        /// Применение миграций к базе данных.
        /// </summary>
        /// <param name="connectionString">Строка подключения к базе данных.</param>
        private void ApplyMigrations(string connectionString)
        {
            try
            {
                Console.WriteLine($"Начинаем применение миграций для базы данных {connectionString}.");

                var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
                optionsBuilder.UseSqlServer(connectionString, options =>
                {
                    options.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null);
                });

                using var context = new ApplicationDbContext(optionsBuilder.Options);
                context.Database.Migrate();

                Console.WriteLine("Миграции успешно применены.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при применении миграций: {ex.Message}");
                throw;
            }
        }
    }

    /// <summary>
    /// Модель для запроса создания пользователя.
    /// </summary>
    public class CreateUserRequest
    {
        public int UserId { get; set; }
        public string DatabaseName { get; set; }
    }
}
