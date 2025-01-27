using FluxÆther.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluxÆther.Data;

namespace FluxÆther.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить список товаров по категории
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int? category)
        {
            if (category == null || category <= 0)
            {
                // Если категория не указана, возвращаем все товары
                var allProducts = await _context.Products
                    .Include(p => p.Category)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Description,
                        p.Price,
                        CategoryName = p.Category != null ? p.Category.Name : "Без категории"
                    })
                    .ToListAsync();

                return Ok(allProducts);
            }

            // Фильтруем товары по категории
            var products = await _context.Products
                .Where(p => p.Categoryid == category)
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    CategoryName = p.Category != null ? p.Category.Name : "Без категории"
                })
                .ToListAsync();

            return Ok(products);
        }

        // Получить товар по ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    CategoryName = p.Category != null ? p.Category.Name : "Без категории"
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("Product not found");

            return Ok(product);
        }

        // Создать новый товар
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories.FindAsync(productDto.Categoryid);
            if (category == null)
                return NotFound("Category not found");

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description ?? "Описание отсутствует",
                Price = productDto.Price,
                Categoryid = productDto.Categoryid
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // Обновить товар
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("Product not found");

            var category = await _context.Categories.FindAsync(productDto.Categoryid);
            if (category == null)
                return NotFound("Category not found");

            product.Name = productDto.Name;
            product.Description = productDto.Description ?? "Описание отсутствует";
            product.Price = productDto.Price;
            product.Categoryid = productDto.Categoryid;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // Удалить товар
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
