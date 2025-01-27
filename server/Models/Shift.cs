using FluxÆther.Models;

/// <summary>
/// Модель данных для представления смены сотрудника.
/// Используется для учета рабочего времени сотрудников.
/// </summary>
public class Shift
{
    public int Id { get; set; } // Уникальный идентификатор смены
    public DateTime Date { get; set; } // Дата смены
    public string StartTime { get; set; } // Время начала смены (в формате строки, например, "08:00")
    public string EndTime { get; set; } // Время окончания смены (в формате строки, например, "17:00")
    public int EmployeeId { get; set; } // Идентификатор сотрудника, связанного со сменой
    public Employee Employee { get; set; } // Связь с моделью сотрудника
}
