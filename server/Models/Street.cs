namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления улицы.
    /// Используется для хранения информации о местоположении, включая дом и подъезд.
    /// </summary>
    public class Street
    {
        public int Id { get; set; } // Уникальный идентификатор улицы
        public string StreetName { get; set; } // Название улицы (обязательное поле)
        public string? House { get; set; } // Номер дома (необязательное поле)
        public string? Entrance { get; set; } // Номер подъезда (необязательное поле)
    }
}
