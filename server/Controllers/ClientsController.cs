using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить всех клиентов с поддержкой пагинации
        [HttpGet]
        public async Task<IActionResult> GetClients([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var clients = await _context.Clients
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(clients); // Убедитесь, что возвращается массив
        }



        // Получить клиента по ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        // Создать клиента
        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] ClientDto clientDto)
        {
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Ошибки валидации: " + string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)));
                return BadRequest(ModelState);
            }

            try
            {
                var client = new Client
                {
                    Name = clientDto.Name,
                    Phone = clientDto.Phone,
                    Street = clientDto.Street,
                    House = clientDto.House,
                    Entrance = clientDto.Entrance,
                    Floor = clientDto.Floor,
                    Flat = clientDto.Flat,
                    Comment = clientDto.Comment
                };

                _context.Clients.Add(client);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetClientById), new { id = client.Id }, client);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при создании клиента: {ex.Message}");
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

        // Обновить клиента (только необходимые поля)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] ClientDto clientDto)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Обновляем только изменённые поля
            client.Name = clientDto.Name ?? client.Name;
            client.Phone = clientDto.Phone ?? client.Phone;
            client.Street = clientDto.Street ?? client.Street;
            client.House = clientDto.House ?? client.House;
            client.Entrance = clientDto.Entrance ?? client.Entrance;
            client.Floor = clientDto.Floor ?? client.Floor;
            client.Flat = clientDto.Flat ?? client.Flat;
            client.Comment = clientDto.Comment ?? client.Comment;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // Удалить клиента
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }

    }
}
