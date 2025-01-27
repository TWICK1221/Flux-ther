// Путь: FluxÆther/Models/OrderTag.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления отметок заказа.
    /// Используется для категоризации или добавления дополнительных характеристик к заказам.
    /// </summary>
    public class OrderTag
    {
        public int Id { get; set; } // Уникальный идентификатор отметки
        public string Name { get; set; } // Название отметки
        public string Color { get; set; } // Цвет отметки (например, в формате HEX-кода)
    }
}
