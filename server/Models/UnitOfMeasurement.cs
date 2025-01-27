// Путь: FluxÆther/Models/UnitOfMeasurement.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления единицы измерения.
    /// Используется для обозначения количества или объема товара (например, "кг", "л", "шт").
    /// </summary>
    public class UnitOfMeasurement
    {
        public int Id { get; set; } // Уникальный идентификатор единицы измерения
        public string Name { get; set; } // Название единицы измерения (например, "кг", "л", "шт")
        public string Description { get; set; } // Описание единицы измерения (необязательное поле)
    }
}
