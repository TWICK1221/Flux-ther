// Путь: FluxÆther/Models/WriteOffReason.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления причин списания.
    /// Используется для учета и управления причинами списания товаров или материалов.
    /// </summary>
    public class WriteOffReason
    {
        public int Id { get; set; } // Уникальный идентификатор причины списания
        public string Reason { get; set; } // Основная причина списания
        public string Description { get; set; } // Дополнительное описание причины списания (необязательно)
    }
}
