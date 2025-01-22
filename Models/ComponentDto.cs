/// <summary>
/// Data Transfer Object (DTO) для передачи данных о компонентах между клиентом и сервером.
/// Используется для упрощенной передачи информации о компонентах и их связях с сырьем.
/// </summary>
public class ComponentDto
{
    public int Id { get; set; } // Уникальный идентификатор компонента
    public string? Name { get; set; } // Название компонента
    public string? Description { get; set; } // Описание компонента (опционально)
    public List<int> RawMaterialIds { get; set; } // Список идентификаторов сырья, связанного с компонентом
}
