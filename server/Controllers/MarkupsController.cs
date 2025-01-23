// Путь: CRMsystem/Controllers/MarkupsController.cs
using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarkupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MarkupsController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetMarkups()
        {
            var markups = await _context.Markups.ToListAsync();
            return Ok(markups);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMarkup([FromBody] Markup markup)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.Markups.AddAsync(markup);
            await _context.SaveChangesAsync();
            return Ok(new { markupId = markup.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMarkup(int id)
        {
            var markup = await _context.Markups.FindAsync(id);
            if (markup == null)
                return NotFound("Наценка не найдена.");

            _context.Markups.Remove(markup);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
