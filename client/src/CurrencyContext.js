import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

// Маппинг ISO-кодов валют к их символам
const currencySymbols = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    KZT: '₸',
};

// Провайдер контекста валюты
export const CurrencyProvider = ({ children }) => {
    // Проверка значения в localStorage
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const [currency, setCurrency] = useState(savedCurrency); // Инициализация из localStorage
    const [loading, setLoading] = useState(true); // Для отслеживания загрузки данных

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const response = await axios.get('/api/SettingSettings/currency'); // Запрос к API
                const fetchedCurrency = response.data || 'USD';
                setCurrency(fetchedCurrency); // Устанавливаем полученную валюту
                localStorage.setItem('currency', fetchedCurrency); // Сохраняем в localStorage
            } catch (error) {
                console.error('Ошибка получения валюты из базы данных:', error);
            } finally {
                setLoading(false); // Завершение загрузки
            }
        };

        // Только если currency не сохранено в localStorage, выполняем запрос к API
        if (!localStorage.getItem('currency')) {
            fetchCurrency();
        } else {
            setLoading(false); // Если значение есть в localStorage, не ждем загрузки
        }
    }, []);

    // Обновляем значение валюты и сохраняем в localStorage
    const updateCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    // Функция для получения символа валюты
    const getCurrencySymbol = () => {
        return currencySymbols[currency] || currency; // Если нет символа, вернуть код
    };

    if (loading) {
        return <div>Загрузка...</div>; // Сообщение о загрузке
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, getCurrencySymbol }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    return useContext(CurrencyContext);
};
