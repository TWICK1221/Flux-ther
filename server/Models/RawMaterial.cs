/// <summary>
/// Модель данных для представления сырья.
/// Используется для хранения информации о сырье, которое используется в компонентах продуктов.
/// </summary>
public class RawMaterial
{
    public int Id { get; set; } // Уникальный идентификатор сырья
    public string Name { get; set; } = string.Empty; // Название сырья
    public decimal Quantity { get; set; } // Количество доступного сырья
    public ICollection<Component> Components { get; set; } = new List<Component>(); // Коллекция компонентов, в которых используется данное сырье
}
