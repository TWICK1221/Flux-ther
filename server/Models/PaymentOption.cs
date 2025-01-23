namespace CRMsystem.Models
{
    /// <summary>
    /// ������ ������ ��� ������������� ������� ������.
    /// ������������ ��� �������� ���������� � ��������� �������� ������ � �������.
    /// </summary>
    public class PaymentOption
    {
        public int Id { get; set; } // ���������� ������������� ������� ������
        public string Name { get; set; } // �������� ������� ������ (��������, "��������" ��� "�����")
    }
}
