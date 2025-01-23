// Controllers/CategoriesController.cs

using Microsoft.AspNetCore.Mvc;
using CRMsystem.Data;
using System.Linq;
using CRMsystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CRMsystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            // Возвращаем список категорий без циклических ссылок
            var categories = _context.Categories
                .Select(c => new
                {
                    c.Id,
                    c.Name
                })
                .ToList();

            return Ok(categories);
        }
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = new Category
            {
                Name = categoryDto.Name
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }
        [HttpGet("{categoryId}/products")]
        public IActionResult GetProductsByCategory(int categoryId)
        {
            var category = _context.Categories
                .Include(c => c.Products) // Загрузка связанных товаров
                .FirstOrDefault(c => c.Id == categoryId);

            if (category == null)
                return NotFound("Category not found");

            var products = category.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                CategoryName = category.Name
            }).ToList();

            return Ok(products);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found");

            // Обновляем поля категории
            category.Name = categoryDto.Name;
            category.Color = categoryDto.Color;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found");

            // Удаляем категорию
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
