//Филиалы
using CRMsystem.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BranchesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BranchesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Branch>>> GetBranches()
    {
        return await _context.Branches.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Branch>> AddBranch(Branch branch)
    {
        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBranches), new { id = branch.Id }, branch);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBranch(int id, Branch branch)
    {
        if (id != branch.Id)
            return BadRequest();

        _context.Entry(branch).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Branches.Any(e => e.Id == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBranch(int id)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null)
            return NotFound();

        _context.Branches.Remove(branch);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
