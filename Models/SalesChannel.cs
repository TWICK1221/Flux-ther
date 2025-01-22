namespace CRMsystem.Models
{
    /// <summary>
    /// Модель данных для представления канала продаж.
    /// Используется для управления различными каналами продаж, такими как сайты, мессенджеры и другие платформы.
    /// </summary>
    public class SalesChannel
    {
        public int Id { get; set; } // Уникальный идентификатор канала продаж
        public string Name { get; set; } // Название канала продаж
        public string Type { get; set; } // Тип канала (например, "Сайт", "Мессенджер")
        public string Description { get; set; } // Описание канала продаж
        public string IntegrationLink { get; set; } // Ссылка для интеграции с каналом
        public bool IsActive { get; set; } // Указывает, включен ли данный канал продаж
    }
}
