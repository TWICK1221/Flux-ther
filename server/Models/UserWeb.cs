using System.ComponentModel.DataAnnotations;

namespace CRMsystem.Models
{
    public class UserWeb
    {
        [Key]
        public int Id { get; set; } // Уникальный идентификатор пользователя

        [Required]
        [StringLength(100)]
        public string Username { get; set; } // Имя пользователя (логин)

        [Required]
        public string PasswordHash { get; set; } // Хэш пароля

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Дата создания пользователя
    }
}
