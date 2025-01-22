/// <summary>
/// Data Transfer Object (DTO) для добавления сырья.
/// Используется для передачи данных о сырье между клиентом и сервером.
/// </summary>
public class AddRawMaterialDto
{
    /// <summary>
    /// Уникальный идентификатор сырья.
    /// </summary>
    public int RawMaterialId { get; set; }
}
