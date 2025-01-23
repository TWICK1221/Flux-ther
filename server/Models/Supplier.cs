// Путь: CRMsystem/Models/Supplier.cs
namespace CRMsystem.Models
{
    /// <summary>
    /// Модель данных для представления поставщика.
    /// Используется для хранения информации о поставщиках товаров или услуг.
    /// </summary>
    public class Supplier
    {
        public int Id { get; set; } // Уникальный идентификатор поставщика
        public string Name { get; set; } // Название поставщика
        public string ContactInfo { get; set; } // Контактная информация поставщика (телефон, email и т.д.)
        public string Address { get; set; } // Адрес поставщика
    }
}
