using FluxÆther.Models;
using System.Collections.Generic;

/// <summary>
/// Модель данных для представления заказа.
/// Используется для хранения информации о заказах, связанных клиентах и товарах.
/// </summary>
public class Order
{
    public int Id { get; set; } // Уникальный идентификатор заказа
    public int? PaymentOptionId { get; set; } // Внешний ключ для PaymentOption
    public PaymentOption PaymentOption { get; set; } // Навигационное свойство
    public DateTime OrderDate { get; set; } // Дата и время оформления заказа
    public decimal TotalAmount { get; set; } // Общая сумма заказа
    public string PaymentMethod { get; set; } // Поле для метода оплаты
    public Client Client { get; set; } // Клиент, связанный с заказом
    public List<OrderItem> Items { get; set; } // Список товаров, входящих в заказ
}
