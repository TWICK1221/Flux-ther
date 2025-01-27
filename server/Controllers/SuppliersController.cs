// Путь: FluxÆther/Controllers/SuppliersController.cs
using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SuppliersController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetSuppliers()
        {
            var suppliers = await _context.Suppliers.ToListAsync();
            return Ok(suppliers);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSupplier([FromBody] Supplier supplier)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.Suppliers.AddAsync(supplier);
            await _context.SaveChangesAsync();
            return Ok(new { supplierId = supplier.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
                return NotFound("Поставщик не найден.");

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
