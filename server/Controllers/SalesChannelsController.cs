using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SalesChannelsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SalesChannelsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesChannel>>> GetChannels()
    {
        return await _context.SalesChannels.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SalesChannel>> AddChannel(SalesChannel channel)
    {
        _context.SalesChannels.Add(channel);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetChannels), new { id = channel.Id }, channel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateChannel(int id, SalesChannel updatedChannel)
    {
        if (id != updatedChannel.Id)
        {
            return BadRequest();
        }

        _context.Entry(updatedChannel).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.SalesChannels.Any(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteChannel(int id)
    {
        var channel = await _context.SalesChannels.FindAsync(id);
        if (channel == null)
        {
            return NotFound();
        }

        _context.SalesChannels.Remove(channel);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
