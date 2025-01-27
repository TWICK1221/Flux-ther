// Путь: Controllers/StreetsController.cs
using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StreetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StreetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStreets()
        {
            var streets = await _context.Streets.ToListAsync();
            return Ok(streets);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStreet([FromBody] Street street)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            _context.Streets.Add(street);
            await _context.SaveChangesAsync();
            return Ok(street);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStreet(int id)
        {
            var street = await _context.Streets.FindAsync(id);
            if (street == null) return NotFound();

            _context.Streets.Remove(street);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
