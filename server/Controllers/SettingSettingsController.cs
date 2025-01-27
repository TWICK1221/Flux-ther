using FluxÆther.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FluxÆther.Models;

[ApiController]
[Route("api/[controller]")]
public class SettingSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingSettingsController(ApplicationDbContext context)
    {
        _context = context;
    }


    // Получение валюты
    [HttpGet("currency")]
    public async Task<IActionResult> GetCurrency()
    {
        try
        {
            var currencySetting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == "currency");
            if (currencySetting == null || string.IsNullOrEmpty(currencySetting.Value))
            {
                return NotFound("Currency not configured.");
            }

            return Ok(new { currency = currencySetting.Value });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching currency: {ex.Message}");
            return StatusCode(500, "An error occurred while fetching the currency.");
        }
    }
}
