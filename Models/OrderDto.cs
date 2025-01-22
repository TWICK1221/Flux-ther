public class OrderDto
{
    public int Id { get; set; }
    public string ClientName { get; set; }
    public string ClientPhone { get; set; }
    public string ClientStreet { get; set; }
    public string ClientHouse { get; set; }
    public string ClientFlat { get; set; }
    public string PaymentOption { get; set; } // Добавлено поле
    public string PaymentMethod { get; set; } // Поле для метода оплаты

    public List<OrderItemDto> Items { get; set; }
}
