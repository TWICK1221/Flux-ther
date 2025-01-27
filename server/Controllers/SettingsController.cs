using FluxÆther.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, string>>> GetSettings()
    {
        return await Task.FromResult(_context.Settings.ToDictionary(s => s.Key, s => s.Value));
    }

    [HttpPost]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> updatedSettings)
    {
        foreach (var setting in updatedSettings)
        {
            var existingSetting = _context.Settings.FirstOrDefault(s => s.Key == setting.Key);
            if (existingSetting != null)
            {
                existingSetting.Value = setting.Value;
            }
            else
            {
                _context.Settings.Add(new Setting { Key = setting.Key, Value = setting.Value });
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("phone-mask")]
    public async Task<IActionResult> GetPhoneMask()
    {
        try
        {
            var setting = await _context.SettingSettings.FirstOrDefaultAsync();
            if (setting == null || string.IsNullOrEmpty(setting.PhoneMask))
            {
                return NotFound("Phone mask not configured.");
            }

            return Ok(setting.PhoneMask);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching phone mask: {ex.Message}");
            return StatusCode(500, "An error occurred while fetching the phone mask.");
        }
    }
}
