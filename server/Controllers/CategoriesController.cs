using Microsoft.AspNetCore.Mvc;
using FluxÆther.Data;
using FluxÆther.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System;

namespace FluxÆther.Controllers
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
            try
            {
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("Некорректные данные в запросе.");
                    return BadRequest(ModelState);
                }

                var category = new Category
                {
                    Name = categoryDto.Name,
                    Color = categoryDto.Color // Убедитесь, что цвет также сохраняется
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Категория '{category.Name}' успешно создана.");
                return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Ошибка при обновлении базы данных: {ex.Message}");
                return StatusCode(500, new { message = "Ошибка при обновлении базы данных", error = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Неизвестная ошибка: {ex.Message}");
                return StatusCode(500, new { message = "Неизвестная ошибка", error = ex.Message });
            }
        }

        [HttpGet("{categoryId}/products")]
        public IActionResult GetProductsByCategory(int categoryId)
        {
            var category = _context.Categories
                .Include(c => c.Products)
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

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CategoryDto
    {
        [Required(ErrorMessage = "Имя категории обязательно.")]
        [StringLength(100, ErrorMessage = "Имя категории должно быть не длиннее 100 символов.")]
        public string Name { get; set; }

        public string Color { get; set; }
    }
}