using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CRMsystem.Data;
using CRMsystem.Models;

namespace CRMsystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShiftsController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<IActionResult> GetShifts()
        {
            try
            {
                var shifts = await _context.Shifts
                    .Include(s => s.Employee)
                    .Select(s => new
                    {
                        Id = s.Id,
                        Date = s.Date,
                        EmployeeName = s.Employee.FirstName, // Используем FirstName
                        StartTime = s.StartTime,
                        EndTime = s.EndTime,
                        Duration = $"{(DateTime.Parse(s.EndTime) - DateTime.Parse(s.StartTime)).TotalHours} часов"
                    })
                    .ToListAsync();

                return Ok(shifts);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при получении смен: {ex.Message}");
                return StatusCode(500, "Ошибка при получении смен.");
            }
        }
    }
}
