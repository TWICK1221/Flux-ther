using System.ComponentModel.DataAnnotations;

/// <summary>
/// Модель данных для представления пользователя.
/// Используется для управления учетными записями пользователей в системе.
/// </summary>
public class User
{
    [Key] // Указывает, что это первичный ключ
    public int Id { get; set; } // Уникальный идентификатор пользователя

    [Required] // Поле обязательно для заполнения
    [StringLength(100)] // Ограничение на длину строки (максимум 100 символов)
    public string Name { get; set; } // Имя пользователя

    [Required]
    [EmailAddress] // Валидатор для проверки корректности email
    public string Email { get; set; } // Электронная почта пользователя

    [Required]
    [StringLength(50, MinimumLength = 6)] // Ограничение длины пароля (от 6 до 50 символов)
    public string Password { get; set; } // Пароль пользователя

    [Required]
    [Range(1, 5)] // Уровень доступа в диапазоне от 1 до 5
    public int AccessLevel { get; set; } // Уровень доступа пользователя
}
