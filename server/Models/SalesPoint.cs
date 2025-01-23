/// <summary>
/// Модель данных для представления точки продаж.
/// Используется для управления информацией о местах продаж компании.
/// </summary>
public class SalesPoint
{
    public int Id { get; set; } // Уникальный идентификатор точки продаж
    public string Name { get; set; } = string.Empty; // Название точки продаж
    public string Address { get; set; } = string.Empty; // Адрес точки продаж
    public string Phone { get; set; } = string.Empty; // Контактный номер телефона точки продаж
    public string ResponsiblePerson { get; set; } = string.Empty; // Ответственное лицо за точку продаж
    public string WorkingHours { get; set; } = string.Empty; // График работы точки продаж
}
