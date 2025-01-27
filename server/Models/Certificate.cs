// Путь: FluxÆther/Models/Certificate.cs
namespace FluxÆther.Models
{
    public class Certificate
    {
        public int Id { get; set; } // Уникальный идентификатор сертификата
        public string Name { get; set; } // Название сертификата
        public decimal Amount { get; set; } // Номинальная стоимость сертификата
        public bool IsForSpecificProduct { get; set; } // Указывает, привязан ли сертификат к определенному товару
        public int? ProductId { get; set; } // Идентификатор товара, если сертификат привязан к конкретному продукту
        public DateTime ExpiryDate { get; set; } // Дата истечения срока действия сертификата
        public bool ApplicableToProduct { get; set; } // Указывает, можно ли применять сертификат к товарам
    }
}
