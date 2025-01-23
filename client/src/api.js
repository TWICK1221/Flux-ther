import axios from "axios";
import React, { useState, useEffect } from "react";

// Инициализация API клиента
const api = axios.create({
    baseURL: "http://localhost:3001/api", // Укажите порт API-сервера
    headers: {
        "Content-Type": "application/json",
    },
});

// Получение текущей валюты из настроек
export const getCurrencyFromSettings = async () => {
    try {
        const response = await api.get('/SettingSettings/currency');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения валюты из настроек:', error);
        return 'USD'; // Значение по умолчанию
    }
};

function App() {
    const [newOrder, setNewOrder] = useState(null);
    const [currency, setCurrency] = useState('USD'); // Хранение текущей валюты

    useEffect(() => {
        const fetchCurrency = async () => {
            const fetchedCurrency = await getCurrencyFromSettings();
            setCurrency(fetchedCurrency);
        };

        fetchCurrency();
    }, []);

    const handleOrderCreated = (order) => {
        setNewOrder(order); // Обновляем состояние с новым заказом
    };

   
}

export { api }; // Экспорт API после инициализации
export default App;
