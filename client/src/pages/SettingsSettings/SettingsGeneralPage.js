import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsGeneralPage.css';
import { useCurrency } from '../../CurrencyContext';

const SettingsGeneralPage = () => {
    const { currency, setCurrency } = useCurrency();
    const [settings, setSettings] = useState({
        companyName: '',
        phoneMask: '',
        timeZone: '',
        dayShift: '00',
        currency: currency || '', // Используем значение из контекста
        paymentOptions: '',
        orderNumbering: '',
        newOrderView: '',
        preOrderButtons: '',
        separateGoodsBranches: false,
        separateClientsBranches: false,
        differentCheckFields: false,
        cashierAccounting: false,
        resetOrderContents: false,
        goToOrdersAfterSave: false,
        roundOrderAmount: false,
        calculateChange: false,
        numberOfPeople: false,
        tableNumber: false,
        showEmailField: false,
        linkMultipleEmployees: false,
        showTagsInOrders: false,
        autoSaveClients: false,
        disableClientDiscounts: false,
        cumulativeDiscounts: false,
        hourlyDiscounts: false,
        accountAndBonusSystem: false,
        apiIntegration: false,
        ipTelephony: false,
        smsNotifications: false,
        deliveryClubIntegration: false,
        yandexFoodIntegration: false,
        clientDatabase: false,
        downloadOrders: false,
        deletedOrders: false,
    });



    useEffect(() => {
        
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Обновление валюты в контексте при изменении
        if (name === 'currency') {
            setCurrency(value);
        }
    };
    useEffect(() => {
        if (!['RUB', 'USD', 'EUR', 'KZT'].includes(currency)) {
            setCurrency('RUB'); // Устанавливаем значение по умолчанию
        }
    }, [currency, setCurrency]);

    const formatPrice = (value) => {
        try {
            const formatter = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: settings.currency, // Например, RUB, USD, EUR, KZT
            });
            return formatter.format(value);
        } catch (error) {
            console.error('Ошибка форматирования цены:', error);
            return value;
        }
    };

    const handleSaveSettings = async () => {
        try {
            const updatedSettings = { ...settings };
            if (!updatedSettings) {
                alert('Маска телефона не может быть пустой.');
                return;
            }

            await axios.post('/api/SettingSettings/update-settings', updatedSettings);
            alert('Настройки успешно сохранены!');
        } catch (error) {
            console.error('Ошибка при сохранении настроек:', error.response?.data || error.message);
            alert('Ошибка при сохранении настроек!');
        }
    };

    return (
        <div className="settings-generalpage">
            <div className="settings-actions">
                <button onClick={handleSaveSettings}>Сохранить настройки</button>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td>Наименование вашей компании</td>
                        <td>
                            <input
                                type="text"
                                name="companyName"
                                value={settings.companyName || ''}
                                onChange={handleInputChange}
                                placeholder="Введите название компании"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Маска телефона</td>
                        <td>
                            <input
                                type="text"
                                name="phoneMask"
                                value={settings.phoneMask || ''}
                                onChange={handleInputChange}
                                placeholder="Введите название компании"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Часовой пояс</td>
                        <td>
                            <input
                                type="text"
                                name="timeZone"
                                value={settings.timeZone || ''}
                                onChange={handleInputChange}
                                placeholder="Введите часовой пояс"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Сдвиг рабочего дня</td>
                        <td>
                            <select
                                name="dayShift"
                                value={settings.dayShift || '00'}
                                onChange={handleInputChange}
                            >
                                {[...Array(24).keys()].map((hour) => (
                                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                                        {hour.toString().padStart(2, '0')}:00
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Валюта</td>
                        <td>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleInputChange}
                            >
                                <option value="RUB">Российский рубль (₽)</option>
                                <option value="USD">Доллар США ($)</option>
                                <option value="EUR">Евро (€)</option>
                                <option value="KZT">Тенге (₸)</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Варианты оплаты заказов</td>
                        <td>
                            <select
                                name="paymentOptions"
                                value={settings.paymentOptions}
                                onChange={handleInputChange}
                            >
                                <option value="cash">Наличные</option>
                                <option value="card">Карта</option>
                                <option value="all">Все</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Нумерация заказов</td>
                        <td>
                            <select
                                name="orderNumbering"
                                value={settings.orderNumbering}
                                onChange={handleInputChange}
                            >
                                <option value="continuous">Не обнулять</option>
                                <option value="daily">Обнулять ежедневно</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Вид раздела "Новый заказ"</td>
                        <td>
                            <select
                                name="newOrderView"
                                value={settings.newOrderView}
                                onChange={handleInputChange}
                            >
                                <option value="tiles">Плитки</option>
                                <option value="list">Список</option>
                                <option value="search">Поиск</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Кнопки предзаказа (мин.)</td>
                        <td>
                            <input
                                type="number"
                                name="preOrderButtons"
                                value={settings.preOrderButtons}
                                onChange={handleInputChange}
                                placeholder="Введите время в минутах"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Отдельные товары и сырье для филиалов</td>
                        <td>
                            <input
                                type="checkbox"
                                name="separateGoodsBranches"
                                checked={settings.separateGoodsBranches}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Отдельные клиенты для филиалов</td>
                        <td>
                            <input
                                type="checkbox"
                                name="separateClientsBranches"
                                checked={settings.separateClientsBranches}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Разные настройки полей чека для точек продаж</td>
                        <td>
                            <input
                                type="checkbox"
                                name="differentCheckFields"
                                checked={settings.differentCheckFields}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {/* Создание заказа */}
                    <tr>
                        <td>Кассовый (сменный) учет</td>
                        <td>
                            <input
                                type="checkbox"
                                name="cashierAccounting"
                                checked={settings.cashierAccounting}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Сброс содержимого заказа</td>
                        <td>
                            <input
                                type="checkbox"
                                name="resetOrderContents"
                                checked={settings.resetOrderContents}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Переходить в раздел Заказы после сохранения заказа</td>
                        <td>
                            <input
                                type="checkbox"
                                name="goToOrdersAfterSave"
                                checked={settings.goToOrdersAfterSave}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Округление суммы заказа</td>
                        <td>
                            <input
                                type="checkbox"
                                name="roundOrderAmount"
                                checked={settings.roundOrderAmount}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Расчет сдачи</td>
                        <td>
                            <input
                                type="checkbox"
                                name="calculateChange"
                                checked={settings.calculateChange}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Кол-во персон в заказе</td>
                        <td>
                            <input
                                type="checkbox"
                                name="numberOfPeople"
                                checked={settings.numberOfPeople}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Номер стола в заказе</td>
                        <td>
                            <input
                                type="checkbox"
                                name="tableNumber"
                                checked={settings.tableNumber}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Поле Email в разделе Новый заказ</td>
                        <td>
                            <input
                                type="checkbox"
                                name="showEmailField"
                                checked={settings.showEmailField}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>"Привязка" нескольких сотрудников к заказу</td>
                        <td>
                            <input
                                type="checkbox"
                                name="linkMultipleEmployees"
                                checked={settings.linkMultipleEmployees}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Показывать отметки в разделе "Заказы"</td>
                        <td>
                            <input
                                type="checkbox"
                                name="showTagsInOrders"
                                checked={settings.showTagsInOrders}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {/* Клиенты и скидки */}
                    <tr>
                        <td>Сохранять клиентов автоматически</td>
                        <td>
                            <input
                                type="checkbox"
                                name="autoSaveClients"
                                checked={settings.autoSaveClients}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Отключить скидки клиентов</td>
                        <td>
                            <input
                                type="checkbox"
                                name="disableClientDiscounts"
                                checked={settings.disableClientDiscounts}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Накопительные скидки</td>
                        <td>
                            <input
                                type="checkbox"
                                name="cumulativeDiscounts"
                                checked={settings.cumulativeDiscounts}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Скидки по часам</td>
                        <td>
                            <input
                                type="checkbox"
                                name="hourlyDiscounts"
                                checked={settings.hourlyDiscounts}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Лицевой счет и бонусная система</td>
                        <td>
                            <input
                                type="checkbox"
                                name="accountAndBonusSystem"
                                checked={settings.accountAndBonusSystem}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {/* Функции */}
                    <tr>
                        <td>API (подключение интернет-магазина)</td>
                        <td>
                            <input
                                type="checkbox"
                                name="apiIntegration"
                                checked={settings.apiIntegration}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>IP-телефония "Простые звонки"</td>
                        <td>
                            <input
                                type="checkbox"
                                name="ipTelephony"
                                checked={settings.ipTelephony}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>SMS уведомления</td>
                        <td>
                            <input
                                type="checkbox"
                                name="smsNotifications"
                                checked={settings.smsNotifications}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Интеграция Delivery Club</td>
                        <td>
                            <input
                                type="checkbox"
                                name="deliveryClubIntegration"
                                checked={settings.deliveryClubIntegration}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Интеграция Яндекс Еда и Деливери Клаб</td>
                        <td>
                            <input
                                type="checkbox"
                                name="yandexFoodIntegration"
                                checked={settings.yandexFoodIntegration}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {/* Администрирование */}
                    <tr>
                        <td>База клиентов</td>
                        <td>
                            <input
                                type="checkbox"
                                name="clientDatabase"
                                checked={settings.clientDatabase}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Скачать заказы</td>
                        <td>
                            <input
                                type="checkbox"
                                name="downloadOrders"
                                checked={settings.downloadOrders}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Удаленные заказы</td>
                        <td>
                            <input
                                type="checkbox"
                                name="deletedOrders"
                                checked={settings.deletedOrders}
                                onChange={handleInputChange}

                            />
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    );
};

export default SettingsGeneralPage;
