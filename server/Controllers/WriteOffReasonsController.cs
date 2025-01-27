// Путь: FluxÆther/Controllers/WriteOffReasonsController.cs
using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WriteOffReasonsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WriteOffReasonsController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetWriteOffReasons()
        {
            var reasons = await _context.WriteOffReasons.ToListAsync();
            return Ok(reasons);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWriteOffReason([FromBody] WriteOffReason reason)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.WriteOffReasons.AddAsync(reason);
            await _context.SaveChangesAsync();
            return Ok(new { reasonId = reason.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWriteOffReason(int id)
        {
            var reason = await _context.WriteOffReasons.FindAsync(id);
            if (reason == null)
                return NotFound("Причина списания не найдена.");

            _context.WriteOffReasons.Remove(reason);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
