using CRMsystem.Models;
using System.Collections.Generic;

/// <summary>
/// ������ ������ ��� ������������� �������� ������.
/// ������������ ��� �������� ���������� � �������, �������� � �����.
/// </summary>
public class OrderItem
{
    public int Id { get; set; } // ���������� ������������� �������� ������
    public int ProductId { get; set; } // ������������� ������
    public Product Product { get; set; } // �����, ��������� � ������ ��������� ������
    public int Quantity { get; set; } // ���������� ������� ������ � ������
    public decimal Price { get; set; } // ���� �� ������� ������
    public Order Order { get; set; } // �����, � �������� ��������� ������ �������
}
