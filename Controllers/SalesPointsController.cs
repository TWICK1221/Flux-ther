using CRMsystem.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SalesPointsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SalesPointsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesPoint>>> GetSalesPoints()
    {
        return await _context.SalesPoints.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SalesPoint>> AddSalesPoint(SalesPoint salesPoint)
    {
        _context.SalesPoints.Add(salesPoint);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSalesPoints), new { id = salesPoint.Id }, salesPoint);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSalesPoint(int id, SalesPoint salesPoint)
    {
        if (id != salesPoint.Id)
            return BadRequest();

        _context.Entry(salesPoint).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.SalesPoints.Any(e => e.Id == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSalesPoint(int id)
    {
        var salesPoint = await _context.SalesPoints.FindAsync(id);
        if (salesPoint == null)
            return NotFound();

        _context.SalesPoints.Remove(salesPoint);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
