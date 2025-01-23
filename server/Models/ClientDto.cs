using System.ComponentModel.DataAnnotations;

/// <summary>
/// Data Transfer Object (DTO) ��� �������� ������ � ������� ����� �������� � ��������.
/// </summary>
public class ClientDto
{
    [Required(ErrorMessage = "��� ������� �����������.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "����� �������� ����������.")]
  
    public string Phone { get; set; }

    public string Street { get; set; }
    public string House { get; set; }
    public string Entrance { get; set; }
    public string Floor { get; set; }
    public string Flat { get; set; }
    public string Comment { get; set; }
}
