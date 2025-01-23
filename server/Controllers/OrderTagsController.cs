// Путь: CRMsystem/Controllers/OrderTagsController.cs
using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderTagsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderTagsController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderTags()
        {
            var tags = await _context.OrderTags.ToListAsync();
            return Ok(tags);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderTag([FromBody] OrderTag tag)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.OrderTags.AddAsync(tag);
            await _context.SaveChangesAsync();
            return Ok(new { tagId = tag.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderTag(int id)
        {
            var tag = await _context.OrderTags.FindAsync(id);
            if (tag == null)
                return NotFound("Отметка не найдена.");

            _context.OrderTags.Remove(tag);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
