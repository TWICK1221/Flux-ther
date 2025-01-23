/// <summary>
/// Модель данных для хранения общих настроек системы.
/// Используется для конфигурации различных параметров работы приложения.
/// </summary>
public class SettingSetting
{
    public int Id { get; set; } // Уникальный идентификатор настройки
    public string CompanyName { get; set; } // Название компании
    public string PhoneMask { get; set; } // Маска для ввода номера телефона
    public string TimeZone { get; set; } // Часовой пояс
    public string DayShift { get; set; } // Сдвиг рабочего дня
    public string Currency { get; set; } // Валюта (например, "RUB", "USD")
    public string PaymentOptions { get; set; } // Способы оплаты
    public string OrderNumbering { get; set; } // Настройки нумерации заказов
    public string NewOrderView { get; set; } // Внешний вид раздела "Новый заказ"
    public int PreOrderButtons { get; set; } // Количество кнопок предзаказа
    public bool SeparateGoodsBranches { get; set; } // Разделение товаров для филиалов
    public bool SeparateClientsBranches { get; set; } // Разделение клиентов для филиалов
    public bool DifferentCheckFields { get; set; } // Разные настройки чеков для точек продаж
    public bool CashierAccounting { get; set; } // Кассовый учет
    public bool ResetOrderContents { get; set; } // Сброс содержимого заказа
    public bool GoToOrdersAfterSave { get; set; } // Переход в заказы после сохранения
    public bool RoundOrderAmount { get; set; } // Округление суммы заказа
    public bool CalculateChange { get; set; } // Расчет сдачи
    public bool NumberOfPeople { get; set; } // Учет количества персон
    public bool TableNumber { get; set; } // Учет номера стола
    public bool ShowEmailField { get; set; } // Отображение поля Email
    public bool LinkMultipleEmployees { get; set; } // Привязка нескольких сотрудников к заказу
    public bool ShowTagsInOrders { get; set; } // Показывать отметки в заказах
    public bool AutoSaveClients { get; set; } // Автоматическое сохранение клиентов
    public bool DisableClientDiscounts { get; set; } // Отключение скидок клиентов
    public bool CumulativeDiscounts { get; set; } // Накопительные скидки
    public bool HourlyDiscounts { get; set; } // Скидки по часам
    public bool AccountAndBonusSystem { get; set; } // Лицевой счет и бонусная система
    public bool ApiIntegration { get; set; } // Интеграция с API
    public bool IpTelephony { get; set; } // Интеграция с IP-телефонией
    public bool SmsNotifications { get; set; } // SMS-уведомления
    public bool DeliveryClubIntegration { get; set; } // Интеграция с Delivery Club
    public bool YandexFoodIntegration { get; set; } // Интеграция с Яндекс Еда
    public bool ClientDatabase { get; set; } // База клиентов
    public bool DownloadOrders { get; set; } // Возможность скачивания заказов
    public bool DeletedOrders { get; set; } // Учет удаленных заказов
}
