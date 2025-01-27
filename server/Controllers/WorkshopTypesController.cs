using FluxÆther.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class WorkshopTypesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkshopTypesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkshopType>>> GetWorkshopTypes()
    {
        return await _context.WorkshopTypes.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<WorkshopType>> AddWorkshopType(WorkshopType workshopType)
    {
        _context.WorkshopTypes.Add(workshopType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorkshopTypes), new { id = workshopType.Id }, workshopType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkshopType(int id, WorkshopType workshopType)
    {
        if (id != workshopType.Id)
            return BadRequest();

        _context.Entry(workshopType).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.WorkshopTypes.Any(e => e.Id == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkshopType(int id)
    {
        var workshopType = await _context.WorkshopTypes.FindAsync(id);
        if (workshopType == null)
            return NotFound();

        _context.WorkshopTypes.Remove(workshopType);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
