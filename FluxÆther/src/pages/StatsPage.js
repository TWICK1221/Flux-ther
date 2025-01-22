// src/pages/StatPage.js
import React, { useState } from 'react';
import '../assets/styles/styles.css'; // Импорт стилей
import '../assets/styles/StatPage.css'; // Импорт стилей




function StatPage() {
    const [selectedTab, setSelectedTab] = useState('stat'); // Состояние для выбранной вкладки

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="stat-page-StatPage">
            <div className="menu">
                <ul>
                    <li onClick={() => handleTabClick('stat')}>Сводка</li>
                    <li onClick={() => handleTabClick('reports')}>Отчеты</li>
                    <li onClick={() => handleTabClick('timesheet')}>Табель</li>
                </ul>
            </div>
            <div className="content">
                {selectedTab === 'stat' && <h2>Сводка</h2>}
                {selectedTab === 'reports' && <h2>Отчеты</h2>}
                {selectedTab === 'timesheet' && <h2>Табель</h2>}
            </div>
        </div>
    );
}

export default StatPage;
