// Путь к файлу: FluxÆther/Models/Category.cs

namespace FluxÆther.Models
{
    public class Category
    {
        public int Id { get; set; } // Уникальный идентификатор категории
        public string Name { get; set; } = string.Empty; // Название категории
        public string Color { get; set; } = "#000000"; // Поле для хранения цвета категории (по умолчанию черный)
        public ICollection<Product> Products { get; set; } = new List<Product>(); // Коллекция продуктов, связанных с категорией
    }
}
