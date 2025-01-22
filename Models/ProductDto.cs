// Путь к файлу: Models/ProductDto.cs
using System.ComponentModel.DataAnnotations;

/// <summary>
/// Data Transfer Object (DTO) для передачи данных о продукте между клиентом и сервером.
/// Используется для упрощения операций с продуктами.
/// </summary>
public class ProductDto
{
    [Required]
    public string Name { get; set; } // Название продукта (обязательно)

    public string Description { get; set; } = "Описание отсутствует"; // Описание продукта (по умолчанию "Описание отсутствует")

    public decimal Price { get; set; } // Цена продукта

    public int Categoryid { get; set; } // Идентификатор категории, к которой принадлежит продукт
}
