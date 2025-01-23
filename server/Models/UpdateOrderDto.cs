public class UpdateOrderDto
{
    public string? ClientName { get; set; }
    public string? ClientPhone { get; set; }
    public string? ClientStreet { get; set; }
    public string? ClientHouse { get; set; }
    public string? ClientEntrance { get; set; }
    public string? ClientFloor { get; set; }
    public string? ClientFlat { get; set; }
    public string? PaymentOption { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
