using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluxÆther.Data;
using FluxÆther.Models;
using System.Text.Json;
using FluxÆther.Models;

namespace FluxÆther.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Метод для форматирования адреса клиента
        private string FormatAddress(Client client)
        {
            if (client == null) return "Адрес отсутствует";

            return $"{(string.IsNullOrWhiteSpace(client.Street) ? "Улица не указана" : client.Street)}, " +
                   $"д.{(string.IsNullOrWhiteSpace(client.House) ? "Не указано" : client.House)}, " +
                   $"{(string.IsNullOrWhiteSpace(client.Flat) ? "" : $"кв.{client.Flat}, ")}" +
                   $"{(string.IsNullOrWhiteSpace(client.Entrance) ? "" : $"Подъезд {client.Entrance}, ")}" +
                   $"{(string.IsNullOrWhiteSpace(client.Floor) ? "" : $"этаж {client.Floor}")}".TrimEnd(',', ' ');
        }



        // Создание заказа
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            if (!ModelState.IsValid || orderDto == null)
                return BadRequest("Данные для создания заказа некорректны.");

            try
            {
                // Проверяем клиента или создаем нового
                var client = await _context.Clients.FirstOrDefaultAsync(c => c.Phone == orderDto.ClientPhone);
                if (client == null)
                {
                    client = new Client
                    {
                        Name = orderDto.ClientName ?? string.Empty,
                        Phone = orderDto.ClientPhone ?? string.Empty,
                        Street = orderDto.ClientStreet ?? string.Empty,
                        House = orderDto.ClientHouse ?? string.Empty,
                        Entrance = orderDto.ClientEntrance ?? string.Empty,
                        Floor = orderDto.ClientFloor ?? string.Empty,
                        Flat = orderDto.ClientFlat ?? string.Empty
                    };
                    await _context.Clients.AddAsync(client);
                }

                // Проверка товаров
                if (orderDto.Items == null || !orderDto.Items.Any())
                    return BadRequest("Необходимо указать товары для заказа.");

                var productIds = orderDto.Items.Select(i => i.ProductId).ToList();
                var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
                if (products.Count != productIds.Count)
                {
                    var missingIds = productIds.Except(products.Select(p => p.Id));
                    return BadRequest($"Товары с ID {string.Join(", ", missingIds)} не найдены.");
                }

                // Создаем заказ
                var order = new Order
                {
                    Client = client,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = orderDto.Items.Sum(i => i.Quantity * i.Price),
                    PaymentMethod = orderDto.PaymentOption,
                    Items = orderDto.Items.Select(i => new OrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        Price = i.Price
                    }).ToList()
                };

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();

                return Ok(new { orderId = order.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при создании заказа: {ex.Message}");
            }
        }


        /// <summary>
        /// /
        /// </summary>

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Client) // Включение данных о клиенте
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                return NotFound($"Заказ с ID {orderId} не найден.");

            return Ok(new
            {
                order.Id,
                order.OrderDate,
                order.TotalAmount,
                order.PaymentMethod,
                Items = order.Items.Select(i => new
                {
                    i.ProductId,
                    ProductName = i.Product.Name,
                    i.Quantity,
                    i.Price,
                    TotalPrice = i.Quantity * i.Price
                }),
                Client = new
                {
                    order.Client.Name,
                    order.Client.Phone,
                    order.Client.Street,
                    order.Client.House,
                    order.Client.Entrance,
                    order.Client.Floor,
                    order.Client.Flat
                }
            });
        }

        // Редактирование заказа
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDto orderDto)
        {
            if (!ModelState.IsValid || orderDto == null)
                return BadRequest("Некорректные данные для обновления заказа.");

            try
            {
                var order = await _context.Orders
                    .Include(o => o.Client)
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound($"Заказ с ID {id} не найден.");

                var client = order.Client;
                client.Name = orderDto.ClientName ?? client.Name;
                client.Phone = orderDto.ClientPhone ?? client.Phone;
                client.Street = orderDto.ClientStreet ?? client.Street;
                client.House = orderDto.ClientHouse ?? client.House;
                client.Entrance = orderDto.ClientEntrance ?? client.Entrance;
                client.Floor = orderDto.ClientFloor ?? client.Floor;
                client.Flat = orderDto.ClientFlat ?? client.Flat;

                // Удаляем старые товары
                _context.OrderItems.RemoveRange(order.Items);

                // Обновляем товары
                var productIds = orderDto.Items.Select(i => i.ProductId).ToList();
                var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
                if (products.Count != productIds.Count)
                {
                    var missingIds = productIds.Except(products.Select(p => p.Id));
                    return BadRequest($"Товары с ID {string.Join(", ", missingIds)} не найдены.");
                }

                order.Items = orderDto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList();

                order.PaymentMethod = orderDto.PaymentOption;
                order.TotalAmount = orderDto.Items.Sum(i => i.Quantity * i.Price);

                await _context.SaveChangesAsync();

                return Ok("Заказ успешно обновлен.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при обновлении заказа: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                // Загружаем данные из базы
                var orders = await _context.Orders
                    .Include(o => o.Client)
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Product) // Убедитесь, что продукты загружаются
                    .Select(o => new
                    {
                        OrderId = o.Id,
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        PaymentMethod = o.PaymentMethod,
                        Items = o.Items.Select(i => new
                        {
                            ProductId = i.ProductId,
                            ProductName = i.Product.Name, // Здесь извлекается имя продукта
                            Quantity = i.Quantity,
                            Price = i.Price,
                            TotalPrice = i.Quantity * i.Price
                        }).ToList(),
                        Client = new
                        {
                            o.Client.Name,
                            o.Client.Phone,
                            o.Client.Street,
                            o.Client.House,
                            o.Client.Entrance,
                            o.Client.Floor,
                            o.Client.Flat
                        }
                    })
                    .ToListAsync();

                // Форматируем адреса после выполнения LINQ-запроса
                var formattedOrders = orders.Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.TotalAmount,
                    o.PaymentMethod,
                    o.Items,
                    Client = new
                    {
                        o.Client.Name,
                        o.Client.Phone,
                        Address = FormatAddress(new Client
                        {
                            Name = o.Client.Name,
                            Phone = o.Client.Phone,
                            Street = o.Client.Street,
                            House = o.Client.House,
                            Entrance = o.Client.Entrance,
                            Floor = o.Client.Floor,
                            Flat = o.Client.Flat
                        })
                    }
                });

                return Ok(formattedOrders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при получении списка заказов: {ex.Message}");
            }
        }

        // Удаление заказа
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound($"Заказ с ID {id} не найден.");

                _context.OrderItems.RemoveRange(order.Items);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok($"Заказ с ID {id} успешно удален.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при удалении заказа: {ex.Message}");
                return StatusCode(500, "Ошибка при удалении заказа.");
            }
        }

       

    }
}
