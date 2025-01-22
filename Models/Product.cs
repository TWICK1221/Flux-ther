// Путь к файлу: CRMsystem/Models/Product.cs
using System.ComponentModel.DataAnnotations;

namespace CRMsystem.Models
{
    /// <summary>
    /// Модель данных для представления продукта.
    /// Используется для хранения информации о товарах в системе.
    /// </summary>
    public class Product
    {
        public int Id { get; set; } // Уникальный идентификатор продукта

        [Required(ErrorMessage = "Название обязательно")]
        [StringLength(100, ErrorMessage = "Название не может превышать 100 символов")]
        public string Name { get; set; } = string.Empty; // Название продукта

        [Required(ErrorMessage = "Описание обязательно")]
        [StringLength(500, ErrorMessage = "Описание не может превышать 500 символов")]
        public string Description { get; set; } = string.Empty; // Описание продукта

        [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше 0")]
        public decimal Price { get; set; } // Цена продукта

        public int Categoryid { get; set; } // Идентификатор категории, к которой принадлежит продукт

        [Required]
        public Category Category { get; set; } // Связь с категорией продукта
    }
}
