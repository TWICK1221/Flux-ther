using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CRMsystem.Data;

namespace CRMsystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComponentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ComponentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить все компоненты
        [HttpGet]
        public async Task<IActionResult> GetComponents([FromQuery] bool includeRawMaterials = false)
        {
            try
            {
                if (includeRawMaterials)
                {
                    var componentsWithRawMaterials = await _context.Components
                        .Include(c => c.RawMaterials)
                        .Select(c => new
                        {
                            c.Id,
                            c.Name,
                            c.Description,
                            RawMaterials = c.RawMaterials.Select(r => new { r.Id, r.Name }).ToList()
                        })
                        .ToListAsync();

                    return Ok(componentsWithRawMaterials);
                }
                else
                {
                    var components = await _context.Components.ToListAsync();
                    return Ok(components);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Ошибка при загрузке компонентов: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // Получить все сырье
        [HttpGet("RawMaterials")]
        public async Task<IActionResult> GetRawMaterials()
        {
            try
            {
                var rawMaterials = await _context.RawMaterials.ToListAsync();
                return Ok(rawMaterials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Создать новый компонент
        [HttpPost]
        public async Task<IActionResult> CreateComponent([FromBody] ComponentDto componentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var component = new Component
            {
                Name = componentDto.Name,
                Description = componentDto.Description,
                RawMaterials = new List<RawMaterial>()
            };

            foreach (var rawMaterialId in componentDto.RawMaterialIds)
            {
                var rawMaterial = await _context.RawMaterials.FindAsync(rawMaterialId);
                if (rawMaterial != null)
                {
                    component.RawMaterials.Add(rawMaterial);
                }
            }

            _context.Components.Add(component);
            await _context.SaveChangesAsync();

            return Ok(component);
        }

        // Добавить сырье в компонент
        [HttpPost("{id}/add-RawMaterials")]
        public async Task<IActionResult> AddRawMaterialToComponent(int id, [FromBody] int rawMaterialId)
        {
            var component = await _context.Components
                .Include(c => c.RawMaterials)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (component == null)
                return NotFound("Component not found");

            var rawMaterial = await _context.RawMaterials.FindAsync(rawMaterialId);
            if (rawMaterial == null)
                return NotFound("Raw material not found");

            component.RawMaterials.Add(rawMaterial);
            await _context.SaveChangesAsync();

            return Ok(component);
        }

        // Обновить компонент
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComponent(int id, [FromBody] ComponentDto componentDto)
        {
            if (id != componentDto.Id)
                return BadRequest("ID mismatch");

            var component = await _context.Components
                .Include(c => c.RawMaterials)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (component == null)
                return NotFound("Component not found");

            component.Name = componentDto.Name;
            component.Description = componentDto.Description;

            // Обновляем связи с сырьем
            var existingRawMaterialIds = component.RawMaterials.Select(r => r.Id).ToHashSet();
            var newRawMaterials = componentDto.RawMaterialIds.Where(id => !existingRawMaterialIds.Contains(id)).ToList();

            foreach (var rawMaterialId in newRawMaterials)
            {
                var rawMaterial = await _context.RawMaterials.FindAsync(rawMaterialId);
                if (rawMaterial != null)
                {
                    component.RawMaterials.Add(rawMaterial);
                }
            }

            component.RawMaterials = component.RawMaterials
            .Where(r => componentDto.RawMaterialIds.Contains(r.Id))
            .ToList();

            await _context.SaveChangesAsync();
            return Ok(component);
        }

        // Удалить компонент
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComponent(int id)
        {
            var component = await _context.Components.FindAsync(id);
            if (component == null)
                return NotFound();

            _context.Components.Remove(component);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
