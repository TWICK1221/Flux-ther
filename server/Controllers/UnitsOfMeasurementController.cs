// Путь: CRMsystem/Controllers/UnitsOfMeasurementController.cs
using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsOfMeasurementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UnitsOfMeasurementController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetUnitsOfMeasurement()
        {
            var units = await _context.UnitsOfMeasurement.ToListAsync();
            return Ok(units);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnitOfMeasurement([FromBody] UnitOfMeasurement unit)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            await _context.UnitsOfMeasurement.AddAsync(unit);
            await _context.SaveChangesAsync();
            return Ok(new { unitId = unit.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnitOfMeasurement(int id)
        {
            var unit = await _context.UnitsOfMeasurement.FindAsync(id);
            if (unit == null)
                return NotFound("Единица измерения не найдена.");

            _context.UnitsOfMeasurement.Remove(unit);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
