using System;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using FluxÆther.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using FluxÆther.Models;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly MasterDbContext _masterDbContext;
        private readonly IConfiguration _configuration;

        public UserController(MasterDbContext masterDbContext, IConfiguration configuration)
        {
            _masterDbContext = masterDbContext ?? throw new ArgumentNullException(nameof(masterDbContext));
            _configuration = configuration;
        }

        /// <summary>
        /// Создание новой базы данных для пользователя.
        /// </summary>
        /// <param name="request">Запрос с данными пользователя.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPost("create")]
        public IActionResult CreateUserDatabase([FromBody] CreateUserRequest request)
        {
            if (request == null || request.UserId <= 0)
            {
                return BadRequest(new { message = "Неверный запрос." });
            }

            var dbName = $"UserDb_{request.UserId}";
            var connectionString = $"Server=(localdb)\\MSSQLLocalDB;Database={dbName};Trusted_Connection=True;";

            try
            {
                // Создание базы данных на основе шаблона
                CreateDatabaseFromTemplate(dbName);

                // Применение миграций
                ApplyMigrations(connectionString);

                // Сохранение информации о базе данных
                SaveDatabaseInfo(request.UserId, dbName, connectionString);

                return Ok(new { message = $"База данных для пользователя {request.UserId} успешно создана." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при создании базы данных: {ex.Message}");
                return StatusCode(500, new { message = "Ошибка при создании базы данных.", error = ex.Message });
            }
        }

        /// <summary>
        /// Создание базы данных из шаблона.
        /// </summary>
        /// <param name="dbName">Имя создаваемой базы данных.</param>
        private void CreateDatabaseFromTemplate(string dbName)
        {
            using var connection = new SqlConnection("Server=(localdb)\\MSSQLLocalDB;Trusted_Connection=True;");
            connection.Open();

            // Создаём новую базу данных
            var createDbCommand = connection.CreateCommand();
            createDbCommand.CommandText = $"CREATE DATABASE [{dbName}]";
            createDbCommand.ExecuteNonQuery();

            // Копируем данные из шаблонной базы TemplateDatabase
            var restoreDbCommand = connection.CreateCommand();
            restoreDbCommand.CommandText = $@"
                USE master;
                RESTORE DATABASE [{dbName}] FROM DISK = 'C:\\Backups\\TemplateDatabase.bak'
                WITH MOVE 'TemplateDatabase_Data' TO 'C:\\SQLData\\{dbName}_Data.mdf',
                     MOVE 'TemplateDatabase_Log' TO 'C:\\SQLData\\{dbName}_Log.ldf'";
            restoreDbCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Применение миграций к базе данных.
        /// </summary>
        /// <param name="connectionString">Строка подключения к базе данных.</param>
        private void ApplyMigrations(string connectionString)
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

        /// <summary>
        /// Сохранение информации о базе данных в MasterDbContext.
        /// </summary>
        /// <param name="userId">ID пользователя.</param>
        /// <param name="dbName">Имя базы данных.</param>
        /// <param name="connectionString">Строка подключения к базе данных.</param>
        private void SaveDatabaseInfo(int userId, string dbName, string connectionString)
        {
            var userDatabase = new UserDatabase
            {
                UserId = userId,
                DatabaseName = dbName,
                ConnectionString = connectionString
            };

            _masterDbContext.UserDatabases.Add(userDatabase);
            _masterDbContext.SaveChanges();
        }
    }

    /// <summary>
    /// Модель запроса на создание базы данных пользователя.
    /// </summary>
    public class CreateUserRequest
    {
        public int UserId { get; set; }
    }
}