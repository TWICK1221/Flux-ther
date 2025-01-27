using FluxÆther.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// Data Transfer Object (DTO) для создания заказа.
/// Используется для передачи данных о новом заказе между клиентом и сервером.
/// </summary>
public class CreateOrderDto
{
    [Required(ErrorMessage = "Имя клиента обязательно")]
    public string ClientName { get; set; } // Имя клиента, для которого создается заказ

    [Required(ErrorMessage = "Телефон клиента обязателен")]
    [Phone(ErrorMessage = "Неверный формат телефона")]
    public string ClientPhone { get; set; } // Контактный номер телефона клиента

    [Required(ErrorMessage = "Улица обязательна")]
    public string PaymentOption { get; set; }
    public string ClientStreet { get; set; } // Улица доставки клиента

    [Required(ErrorMessage = "Дом обязателен")]
    public string ClientHouse { get; set; } // Номер дома клиента

    public string ClientEntrance { get; set; } // Номер подъезда (опционально)
    public string ClientFloor { get; set; } // Этаж клиента (опционально)
    public string ClientFlat { get; set; } // Номер квартиры клиента (опционально)

    [Required(ErrorMessage = "Список товаров обязателен")]
    public List<OrderItemDto> Items { get; set; } // Список товаров в заказе
}

/// <summary>
/// Data Transfer Object (DTO) для передачи данных о товаре в заказе.
/// </summary>
public class OrderItemDto
{
    public int ProductId { get; set; } // Идентификатор товара
    public int Quantity { get; set; } // Количество товара
    public decimal Price { get; set; } // Цена товара
}
