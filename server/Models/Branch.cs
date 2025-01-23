/// <summary>
/// Модель данных для представления филиалов компании.
/// Используется для хранения информации о филиалах.
/// </summary>
public class Branch
{
    public int Id { get; set; } // Уникальный идентификатор филиала
    public string Name { get; set; } = string.Empty; // Название филиала
    public string Address { get; set; } = string.Empty; // Адрес филиала
    public string Phone { get; set; } = string.Empty; // Контактный номер телефона филиала
    public string WorkingHours { get; set; } = string.Empty; // График работы филиала
}
