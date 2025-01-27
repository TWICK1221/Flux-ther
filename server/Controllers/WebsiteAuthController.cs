using Microsoft.AspNetCore.Mvc;
using FluxÆther.Data;
using FluxÆther.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/website-auth")]
    public class WebsiteAuthController : ControllerBase
    {
        private readonly MasterDbContext _masterDbContext;
        private readonly DatabaseHelper _databaseHelper;

        public WebsiteAuthController(MasterDbContext masterDbContext, DatabaseHelper databaseHelper)
        {
            _masterDbContext = masterDbContext ?? throw new ArgumentNullException(nameof(masterDbContext));
            _databaseHelper = databaseHelper ?? throw new ArgumentNullException(nameof(databaseHelper));
        }

        /// <summary>
        /// Регистрация нового пользователя с созданием базы данных.
        /// </summary>
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Некорректные данные для регистрации" });
            }

            if (_masterDbContext.UserWebs.Any(u => u.Username == request.Username))
            {
                return Conflict(new { message = "Имя пользователя уже занято" });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new UserWeb
            {
                Username = request.Username,
                PasswordHash = hashedPassword
            };

            _masterDbContext.UserWebs.Add(newUser);
            _masterDbContext.SaveChanges();

            // Создание базы данных для нового пользователя
            var databaseName = $"UserDb_{newUser.Id}";
            try
            {
                var connectionString = CreateDatabaseFromTemplate(databaseName);

                // Сохранение информации о базе данных
                var userDatabase = new Data.UserDatabase
                {
                    UserId = newUser.Id,
                    DatabaseName = databaseName,
                    ConnectionString = connectionString
                };

                _masterDbContext.UserDatabases.Add(userDatabase);
                _masterDbContext.SaveChanges();

                return Ok(new { message = "Регистрация успешна, база данных создана." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при создании базы данных: {ex.Message}");
                return StatusCode(500, new { message = "Ошибка при создании базы данных", error = ex.Message });
            }
        }

        /// <summary>
        /// Авторизация пользователя.
        /// </summary>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            Console.WriteLine("Получен запрос на вход: " + JsonSerializer.Serialize(request));

            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                Console.WriteLine("Некорректные данные для авторизации");
                return BadRequest(new { message = "Некорректные данные для авторизации" });
            }

            var user = _masterDbContext.UserWebs.FirstOrDefault(u => u.Username == request.Username);
            if (user == null)
            {
                Console.WriteLine("Пользователь не найден: " + request.Username);
                return NotFound(new { message = "Пользователь не найден" });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                Console.WriteLine("Неверный пароль для пользователя: " + request.Username);
                return Unauthorized(new { message = "Неверное имя пользователя или пароль" });
            }

            var token = GenerateJwtToken(user);
            Console.WriteLine("Токен успешно сгенерирован для пользователя: " + request.Username);

            return Ok(new { token });
        }

        /// <summary>
        /// Генерация JWT-токена.
        /// </summary>
        private string GenerateJwtToken(UserWeb user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("5f4dcc3b5aa765d61d8327deb882cf99"); // Используйте безопасный ключ
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("UserId", user.Id.ToString()) // Добавляем идентификатор пользователя
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Создание базы данных из шаблона.
        /// </summary>
        private string CreateDatabaseFromTemplate(string databaseName)
        {
            var serverConnectionString = "Server=(localdb)\\MSSQLLocalDB;Trusted_Connection=True;";
            var templateDatabaseName = "TemplateDatabase";

            using (var connection = new SqlConnection(serverConnectionString))
            {
                connection.Open();

                // Удаление существующей базы данных
                using (var dropDbCommand = connection.CreateCommand())
                {
                    dropDbCommand.CommandText = $@"
                        IF EXISTS (SELECT name FROM sys.databases WHERE name = N'{databaseName}')
                        BEGIN
                            ALTER DATABASE [{databaseName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                            DROP DATABASE [{databaseName}];
                        END";
                    dropDbCommand.ExecuteNonQuery();
                }

                // Создание новой базы данных
                using (var createDbCommand = connection.CreateCommand())
                {
                    createDbCommand.CommandText = $"CREATE DATABASE [{databaseName}]";
                    createDbCommand.ExecuteNonQuery();
                }

                // Применение миграций
                var connectionString = $"Server=(localdb)\\MSSQLLocalDB;Database={databaseName};Trusted_Connection=True;";
                _databaseHelper.ApplyMigrations(connectionString);

                // Копирование данных из TemplateDatabase
                foreach (var tableName in new[]
                {
                    "Branches", "Categories", "Certificates", "Clients", "Components",
                    "Discounts", "Employees", "Markups", "Orders", "OrderItems",
                    "PaymentOptions", "Products", "SalesChannels", "Settings", "Shifts",
                    "Statuses", "Streets", "Suppliers", "UserWebs", "WorkshopTypes"
                })
                {
                    try
                    {
                        using (var copyCommand = connection.CreateCommand())
                        {
                            copyCommand.CommandText = $@"
                                INSERT INTO [{databaseName}].[dbo].[{tableName}]
                                SELECT * FROM [{templateDatabaseName}].[dbo].[{tableName}]";
                            copyCommand.ExecuteNonQuery();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка при копировании таблицы {tableName}: {ex.Message}");
                    }
                }
            }

            return $"Server=(localdb)\\MSSQLLocalDB;Database={databaseName};Trusted_Connection=True;";
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}