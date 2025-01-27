// Путь: FluxÆther/Controllers/DiscountsController.cs
using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DiscountsController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetDiscounts()
        {
            var discounts = await _context.Discounts.ToListAsync();
            return Ok(discounts);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDiscount([FromBody] Discount discount)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.Discounts.AddAsync(discount);
            await _context.SaveChangesAsync();
            return Ok(new { discountId = discount.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
                return NotFound("Скидка не найдена.");

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
