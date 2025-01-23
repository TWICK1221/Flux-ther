/// <summary>
/// Модель данных для хранения настройки системы.
/// Используется для сохранения ключей и значений конфигурации.
/// </summary>
public class Setting
{
    public int Id { get; set; } // Уникальный идентификатор настройки
    public string Key { get; set; } // Ключ настройки (например, "CompanyName", "Currency")
    public string Value { get; set; } // Значение настройки (например, "MyCompany", "USD")
}
