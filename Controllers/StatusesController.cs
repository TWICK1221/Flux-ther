// Путь: CRMsystem/Controllers/StatusesController.cs
using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatusesController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _context.Statuses.ToListAsync();
            return Ok(statuses);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus([FromBody] Status status)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.Statuses.AddAsync(status);
            await _context.SaveChangesAsync();
            return Ok(new { statusId = status.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);
            if (status == null)
                return NotFound("Статус не найден.");

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
