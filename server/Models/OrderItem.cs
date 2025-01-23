using CRMsystem.Models;
using System.Collections.Generic;

/// <summary>
/// Модель данных для представления элемента заказа.
/// Используется для хранения информации о товарах, входящих в заказ.
/// </summary>
public class OrderItem
{
    public int Id { get; set; } // Уникальный идентификатор элемента заказа
    public int ProductId { get; set; } // Идентификатор товара
    public Product Product { get; set; } // Товар, связанный с данным элементом заказа
    public int Quantity { get; set; } // Количество данного товара в заказе
    public decimal Price { get; set; } // Цена за единицу товара
    public Order Order { get; set; } // Заказ, к которому относится данный элемент
}
