namespace CRMsystem.Models
{
    /// <summary>
    /// Модель данных для представления способа оплаты.
    /// Используется для хранения информации о возможных способах оплаты в системе.
    /// </summary>
    public class PaymentOption
    {
        public int Id { get; set; } // Уникальный идентификатор способа оплаты
        public string Name { get; set; } // Название способа оплаты (например, "Наличные" или "Карта")
    }
}
