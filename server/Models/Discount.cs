// Путь: FluxÆther/Models/Discount.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления скидок.
    /// Используется для хранения и управления информацией о скидках.
    /// </summary>
    public class Discount
    {
        public int Id { get; set; } // Уникальный идентификатор скидки
        public string Name { get; set; } // Название скидки
        public decimal Percentage { get; set; } // Процент скидки (например, 10.5% представлено как 10.5)
        public bool IsActive { get; set; } // Указывает, активна ли скидка
    }
}
