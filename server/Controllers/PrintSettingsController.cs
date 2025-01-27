using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PrintSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PrintSettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PrintSettings>> GetSettings()
    {
        var settings = await _context.PrintSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            return NotFound();
        }
        return settings;
    }

    [HttpPost]
    public async Task<IActionResult> SaveSettings(PrintSettings newSettings)
    {
        var existingSettings = await _context.PrintSettings.FirstOrDefaultAsync();
        if (existingSettings == null)
        {
            _context.PrintSettings.Add(newSettings);
        }
        else
        {
            // Обновляем существующие настройки
            existingSettings.HeaderText = newSettings.HeaderText;
            existingSettings.FooterText = newSettings.FooterText;
            existingSettings.PaperSize = newSettings.PaperSize;
            existingSettings.IncludeDate = newSettings.IncludeDate;
            existingSettings.IncludeOrderNumber = newSettings.IncludeOrderNumber;
            existingSettings.IncludeCustomerName = newSettings.IncludeCustomerName;
            existingSettings.IncludeItems = newSettings.IncludeItems;
            existingSettings.IncludeTotal = newSettings.IncludeTotal;
            existingSettings.FontSize = newSettings.FontSize;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}
