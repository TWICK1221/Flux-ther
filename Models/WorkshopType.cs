/// <summary>
/// Модель данных для представления типа цеха.
/// Используется для хранения информации о различных типах цехов.
/// </summary>
public class WorkshopType
{
    public int Id { get; set; } // Уникальный идентификатор типа цеха
    public string Name { get; set; } = string.Empty; // Название типа цеха
    public string Description { get; set; } = string.Empty; // Описание типа цеха
}
