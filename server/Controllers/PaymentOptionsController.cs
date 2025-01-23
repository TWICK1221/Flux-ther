using CRMsystem.Data;
using CRMsystem.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRMsystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentOptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentOptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPaymentOptions()
        {
            return Ok(_context.PaymentOptions.ToList());
        }

        [HttpPost]
        public IActionResult CreatePaymentOption([FromBody] PaymentOption option)
        {
            if (string.IsNullOrWhiteSpace(option.Name))
            {
                return BadRequest("�������� �������� ������ �� ����� ���� ������.");
            }

            _context.PaymentOptions.Add(option);
            _context.SaveChanges();
            return Ok(option);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePaymentOption(int id, [FromBody] PaymentOption option)
        {
            var existingOption = _context.PaymentOptions.Find(id);
            if (existingOption == null)
            {
                return NotFound();
            }

            existingOption.Name = option.Name;
            _context.SaveChanges();
            return Ok(existingOption);
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePaymentOption(int id)
        {
            var option = _context.PaymentOptions.Find(id);
            if (option == null)
            {
                return NotFound();
            }

            _context.PaymentOptions.Remove(option);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
