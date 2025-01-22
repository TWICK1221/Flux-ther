// DTO для передачи данных о сертификатах между клиентом и сервером
namespace CRMsystem.Models
{
    public class CertificateDto
    {
        public string Name { get; set; } // Название сертификата
        public decimal Amount { get; set; } // Номинальная стоимость сертификата
        public DateTime ExpiryDate { get; set; } // Дата истечения срока действия сертификата
        public bool ApplicableToProduct { get; set; } // Указывает, можно ли применять сертификат к товарам
    }
}
