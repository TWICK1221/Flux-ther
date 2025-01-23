/// <summary>
/// Модель данных для представления компонента продукта.
/// Используется для управления компонентами и их связями с сырьем.
/// </summary>
public class Component
{
    public int Id { get; set; } // Уникальный идентификатор компонента
    public string Name { get; set; } // Название компонента
    public string Description { get; set; } // Описание компонента
    public ICollection<RawMaterial> RawMaterials { get; set; } = new List<RawMaterial>(); // Коллекция сырья, связанного с компонентом
}
