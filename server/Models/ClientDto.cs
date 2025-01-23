using System.ComponentModel.DataAnnotations;

/// <summary>
/// Data Transfer Object (DTO) для передачи данных о клиенте между клиентом и сервером.
/// </summary>
public class ClientDto
{
    [Required(ErrorMessage = "Имя клиента обязательно.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Номер телефона обязателен.")]
  
    public string Phone { get; set; }

    public string Street { get; set; }
    public string House { get; set; }
    public string Entrance { get; set; }
    public string Floor { get; set; }
    public string Flat { get; set; }
    public string Comment { get; set; }
}
