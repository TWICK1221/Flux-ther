// Путь: FluxÆther/Models/Markup.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления наценок.
    /// Используется для хранения и управления информацией о наценках.
    /// </summary>
    public class Markup
    {
        public int Id { get; set; } // Уникальный идентификатор наценки
        public string Name { get; set; } // Название наценки
        public decimal Percentage { get; set; } // Процент наценки (например, 15.5% представлено как 15.5)
        public bool IsActive { get; set; } // Указывает, активна ли наценка
    }
}
