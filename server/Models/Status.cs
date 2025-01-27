// Путь: FluxÆther/Models/Status.cs
namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления статуса.
    /// Используется для описания текущего состояния объекта, например, заказа или задачи.
    /// </summary>
    public class Status
    {
        public int Id { get; set; } // Уникальный идентификатор статуса
        public string Name { get; set; } // Название статуса (например, "В процессе", "Завершен")
        public bool IsActive { get; set; } // Указывает, активен ли данный статус
    }
}
