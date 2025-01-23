import React, { useState, useEffect } from 'react';
import './PrintSettingsPage.css';

const PrintSettingsPage = () => {
    const [settings, setSettings] = useState({
        headerText: '',
        footerText: '',
        paperSize: '80mm',
        includeDate: true,
        includeOrderNumber: true,
        includeCustomerName: false,
        includeItems: true,
        includeTotal: true,
        fontSize: 'medium',
    });

    // Загрузка настроек из API
    useEffect(() => {
        fetch('/api/PrintSettings')
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setSettings(data);
                }
            })
            .catch((error) => console.error('Ошибка при загрузке настроек:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveSettings = () => {
        fetch('/api/PrintSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Настройки сохранены!');
                } else {
                    alert('Ошибка при сохранении настроек');
                }
            })
            .catch((error) => console.error('Ошибка при сохранении настроек:', error));
    };

    return (
        <div className="print-settings-page">
            <h2>Настройки печати чека</h2>
            <div className="settings-container">
                <table>
                    <tbody>
                        <tr>
                            <td>Текст в шапке</td>
                            <td>
                                <textarea
                                    name="headerText"
                                    value={settings.headerText}
                                    onChange={handleInputChange}
                                    placeholder="Введите текст, который будет отображаться в шапке чека"
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>Текст в подвале</td>
                            <td>
                                <textarea
                                    name="footerText"
                                    value={settings.footerText}
                                    onChange={handleInputChange}
                                    placeholder="Введите текст, который будет отображаться внизу чека"
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>Размер бумаги</td>
                            <td>
                                <select
                                    name="paperSize"
                                    value={settings.paperSize}
                                    onChange={handleInputChange}
                                >
                                    <option value="80mm">80 мм</option>
                                    <option value="58mm">58 мм</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Включить дату</td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="includeDate"
                                    checked={settings.includeDate}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Включить номер заказа</td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="includeOrderNumber"
                                    checked={settings.includeOrderNumber}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Включить имя клиента</td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="includeCustomerName"
                                    checked={settings.includeCustomerName}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Включить товары</td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="includeItems"
                                    checked={settings.includeItems}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Включить итог</td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="includeTotal"
                                    checked={settings.includeTotal}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Размер шрифта</td>
                            <td>
                                <select
                                    name="fontSize"
                                    value={settings.fontSize}
                                    onChange={handleInputChange}
                                >
                                    <option value="small">Маленький</option>
                                    <option value="medium">Средний</option>
                                    <option value="large">Крупный</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="save-button" onClick={handleSaveSettings}>
                    Сохранить настройки
                </button>
            </div>
        </div>
    );
};

export default PrintSettingsPage;