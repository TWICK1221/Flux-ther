using Microsoft.AspNetCore.Mvc;
using CRMsystem.Data;
using CRMsystem.Models;
using BCrypt.Net;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/website-auth")]
    public class WebsiteAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WebsiteAuthController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <summary>
        /// Авторизация пользователя.
        /// </summary>
        /// <param name="request">Запрос, содержащий логин и пароль.</param>
        /// <returns>Токен доступа или ошибка авторизации.</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                Console.WriteLine("Неверный запрос авторизации");
                return BadRequest(new { message = "Некорректные данные для авторизации" });
            }

            Console.WriteLine($"Проверяем логин: {request.Username}");

            var user = _context.UserWebs.FirstOrDefault(u => u.Username == request.Username);
            if (user == null)
            {
                Console.WriteLine("Пользователь не найден");
                return NotFound(new { message = "Пользователь не найден" });
            }

            Console.WriteLine("Пользователь найден, проверяем пароль...");
            if (BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                Console.WriteLine("Пароль верный");
                var token = Guid.NewGuid().ToString();
                return Ok(new { token });
            }

            Console.WriteLine("Пароль неверный");
            return Unauthorized(new { message = "Неверный пароль" });
        }
    }

    /// <summary>
    /// Модель запроса для авторизации.
    /// </summary>
    public class LoginRequest
    {
        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Пароль пользователя.
        /// </summary>
        public string Password { get; set; }
    }
}
