using CRMsystem.Models;
using System.Collections.Generic;

/// <summary>
/// ������ ������ ��� ������������� ������.
/// ������������ ��� �������� ���������� � �������, ��������� �������� � �������.
/// </summary>
public class Order
{
    public int Id { get; set; } // ���������� ������������� ������
    public int? PaymentOptionId { get; set; } // ������� ���� ��� PaymentOption
    public PaymentOption PaymentOption { get; set; } // ������������� ��������
    public DateTime OrderDate { get; set; } // ���� � ����� ���������� ������
    public decimal TotalAmount { get; set; } // ����� ����� ������
    public string PaymentMethod { get; set; } // ���� ��� ������ ������
    public Client Client { get; set; } // ������, ��������� � �������
    public List<OrderItem> Items { get; set; } // ������ �������, �������� � �����
}
