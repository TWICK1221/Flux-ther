// src/pages/CashPage.js

import React, { useState } from 'react';
import '../assets/styles/styles.css'; // Импорт стилей
import '../assets/styles/CashPage.css'; // Импорт стилей

function CashPage() {
    // Состояние для отслеживания текущей выбранной вкладки
    const [selectedTab, setSelectedTab] = useState('cashbox');

    // Обработчик кликов по вкладкам
    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="cash-page-CashPage">
            {/* Меню навигации */}
            <div className="menu">
                <ul>
                    <li
                        className={selectedTab === 'cashbox' ? 'active' : ''}
                        onClick={() => handleTabClick('cashbox')}
                    >
                        Касса
                    </li>
                    <li
                        className={selectedTab === 'costs' ? 'active' : ''}
                        onClick={() => handleTabClick('costs')}
                    >
                        Прочие расходы
                    </li>
                    <li
                        className={selectedTab === 'salary' ? 'active' : ''}
                        onClick={() => handleTabClick('salary')}
                    >
                        Зарплата
                    </li>
                </ul>
            </div>

            {/* Контент вкладок */}
            <div className="content">
                {selectedTab === 'cashbox' && (
                    <div>
                        <h2>Касса</h2>
                        <p>Здесь отображается информация о кассе.</p>
                    </div>
                )}
                {selectedTab === 'costs' && (
                    <div>
                        <h2>Прочие расходы</h2>
                        <p>Здесь вы можете просматривать и добавлять прочие расходы.</p>
                    </div>
                )}
                {selectedTab === 'salary' && (
                    <div>
                        <h2>Зарплата</h2>
                        <p>Отображение информации о зарплате сотрудников.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CashPage;
