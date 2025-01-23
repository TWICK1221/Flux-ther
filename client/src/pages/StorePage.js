// src/pages/StorePage.js
import React, { useState } from 'react';
import '../assets/styles/styles.css'; // Импорт стилей
import '../assets/styles/StorePage.css'; // Импорт стилей





function StorePage() {
    const [selectedTab, setSelectedTab] = useState('s_orders'); // Состояние для выбранной вкладки

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="store-page-StorePage">
            <div className="menu">
                <ul>
                    <li onClick={() => handleTabClick('s_orders')}>Накладные</li>
                    <li onClick={() => handleTabClick('s_writeoff')}>Списания</li>
                    <li onClick={() => handleTabClick('s_issue')}>Выпуск</li>
                    <li onClick={() => handleTabClick('s_movement')}>Перемещение</li>
                    <li onClick={() => handleTabClick('s_stock')}>Остатки</li>
                    <li onClick={() => handleTabClick('s_revis')}>Инвентаризации</li>
                    <li onClick={() => handleTabClick('auto')}>Автосписание</li>
                </ul>
            </div>
            <div className="content">
                {selectedTab === 's_orders' && <h2>Накладные</h2>}
                {selectedTab === 's_writeoff' && <h2>Списания</h2>}
                {selectedTab === 's_issue' && <h2>Выпуск</h2>}
                {selectedTab === 's_movement' && <h2>Перемещение</h2>}
                {selectedTab === 's_stock' && <h2>Остатки</h2>}
                {selectedTab === 's_revis' && <h2>Инвентаризации</h2>}
                {selectedTab === 'auto' && <h2>Автосписание</h2>}
            </div>
        </div>
    );
}

export default StorePage;
