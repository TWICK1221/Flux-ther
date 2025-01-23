using System.ComponentModel.DataAnnotations;

namespace CRMsystem.Models
{
    public class Client
    {
        public int Id { get; set; } // Уникальный идентификатор клиента

        [Required]
        public required string Phone { get; set; } // Телефон клиента (обязательное поле)

        [Required]
        public required string Name { get; set; } // Имя клиента (обязательное поле)

        public string Street { get; set; } // Улица, указанная клиентом
        public string House { get; set; } // Номер дома
        public string Entrance { get; set; } // Номер подъезда
        public string Floor { get; set; } // Этаж
        public string Flat { get; set; } // Номер квартиры
        public string? Comment { get; set; } // Дополнительный комментарий (опционально)

        public List<Order> Orders { get; set; } // Список заказов, связанных с клиентом

        public Client()
        {
            // Инициализация строковых значений по умолчанию
            Street = string.Empty;
            House = string.Empty;
            Entrance = string.Empty;
            Floor = string.Empty;
            Flat = string.Empty;
            Comment = null; // Комментарий допускает значение null
        }
    }
}
