using FluxÆther.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class RawMaterialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RawMaterialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Метод для создания сырья
    [HttpPost]
    public async Task<IActionResult> CreateRawMaterial([FromBody] RawMaterial rawMaterial)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            _context.RawMaterials.Add(rawMaterial);
            await _context.SaveChangesAsync();
            return Ok(rawMaterial);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetRawMaterials()
    {
        var rawMaterials = await _context.RawMaterials.ToListAsync();
        return Ok(rawMaterials);
    }

    // Изменить сырье
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRawMaterial(int id, [FromBody] RawMaterial rawMaterial)
    {
        if (id != rawMaterial.Id)
            return BadRequest("ID mismatch");

        var existingRawMaterial = await _context.RawMaterials.FindAsync(id);
        if (existingRawMaterial == null)
            return NotFound("Raw material not found");

        try
        {
            existingRawMaterial.Name = rawMaterial.Name;
            existingRawMaterial.Quantity = rawMaterial.Quantity;

            await _context.SaveChangesAsync();
            return Ok(existingRawMaterial);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Удалить сырье
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRawMaterial(int id)
    {
        var rawMaterial = await _context.RawMaterials.FindAsync(id);
        if (rawMaterial == null)
            return NotFound("Raw material not found");

        try
        {
            _context.RawMaterials.Remove(rawMaterial);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
