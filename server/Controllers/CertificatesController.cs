// Путь: FluxÆther/Controllers/CertificatesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluxÆther.Data;
using FluxÆther.Models;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CertificatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CertificatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCertificates()
        {
            var certificates = await _context.Certificates.ToListAsync();
            return Ok(certificates);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCertificate([FromBody] CertificateDto certificateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные для создания сертификата.");

            var certificate = new Certificate
            {
                Name = certificateDto.Name,
                Amount = certificateDto.Amount,
                ExpiryDate = certificateDto.ExpiryDate,
                ApplicableToProduct = certificateDto.ApplicableToProduct
            };

            await _context.Certificates.AddAsync(certificate);
            await _context.SaveChangesAsync();

            return Ok(new { certificateId = certificate.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
                return NotFound();

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
