using System.ComponentModel.DataAnnotations;

namespace FluxÆther.Models
{
    /// <summary>
    /// Модель данных для представления сотрудника.
    /// Используется для хранения информации о сотрудниках компании.
    /// </summary>
    public class Employee
    {
        public int Id { get; set; } // Уникальный идентификатор сотрудника

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } // Имя сотрудника (обязательно, максимум 50 символов)

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } // Фамилия сотрудника (обязательно, максимум 50 символов)

        [MaxLength(50)]
        public string MiddleName { get; set; } // Отчество сотрудника (опционально, максимум 50 символов)

        [MaxLength(100)]
        public string Position { get; set; } // Должность сотрудника (максимум 100 символов)

        [MaxLength(15)]
        public string Phone { get; set; } // Контактный номер телефона сотрудника (максимум 15 символов)

        [MaxLength(100)]
        public string Email { get; set; } // Электронная почта сотрудника (максимум 100 символов)
    }
}
