import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Стили проекта
import App from './App'; // Основной компонент приложения
import reportWebVitals from './reportWebVitals'; // Для метрик производительности
import { CurrencyProvider } from './CurrencyContext'; // Провайдер для управления валютным контекстом

// Получение корневого элемента из index.html
const rootElement = document.getElementById('root');

// Проверка существования корневого элемента
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    // Рендер приложения с использованием контекста
    root.render(
        <React.StrictMode>
            <CurrencyProvider>
                <App />
            </CurrencyProvider>
        </React.StrictMode>
    );
} else {
    console.error('Элемент с ID root не найден. Проверьте index.html в папке public.');
}

// Включение метрик производительности приложения
reportWebVitals(console.log);
