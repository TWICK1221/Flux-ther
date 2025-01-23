namespace CRMsystem.Models
{
    /// <summary>
    /// Модель данных для настроек печати чека.
    /// Используется для хранения пользовательских настроек формата чека.
    /// </summary>
    public class PrintSettings
    {
        public int Id { get; set; } // Уникальный идентификатор
        public string HeaderText { get; set; } // Текст, отображаемый в шапке чека
        public string FooterText { get; set; } // Текст, отображаемый в подвале чека
        public string PaperSize { get; set; } // Размер бумаги для печати (например, "80mm")
        public bool IncludeDate { get; set; } // Включить дату в чеке
        public bool IncludeOrderNumber { get; set; } // Включить номер заказа в чеке
        public bool IncludeCustomerName { get; set; } // Включить имя клиента в чеке
        public bool IncludeItems { get; set; } // Включить список товаров в чеке
        public bool IncludeTotal { get; set; } // Включить итоговую сумму заказа
        public string FontSize { get; set; } // Размер шрифта для текста чека
    }
}
