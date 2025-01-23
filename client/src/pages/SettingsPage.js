// src/pages/SettingsPage.js
import React, { useState } from 'react';
import '../assets/styles/styles.css'; // Импорт стилей
import '../assets/styles/SettingsPage.css'; // Импорт стилей
import SettingsPaymentPage from './SettingsSettings/SettingsPaymentPage';
import SettingsUsersPage from './SettingsSettings/SettingsUsersPage';
import SettingsGeneralPage from './SettingsSettings/SettingsGeneralPage';
import PrintSettingsPage from './SettingsSettings/PrintSettingsPage';
import SalesChannelsPage from './SettingsSettings/SalesChannelsPage';
import BranchesPage from './SettingsSettings/BranchesPage';
import SalesPointsPage from './SettingsSettings/SalesPointsPage';
import WorkshopTypesPage from './SettingsSettings/WorkshopTypesPage';


function SettingsPage() {
    const [selectedTab, setSelectedTab] = useState('payment'); // Состояние для выбранной вкладки

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="settings-page-SettingsPage">
            <div className="menu">
                <ul>
                    <li onClick={() => handleTabClick('payment')}>Лицевой счет и тариф</li>
                    <li onClick={() => handleTabClick('users')}>Пользователи</li>
                    <li onClick={() => handleTabClick('couriers')}>Доступ курьеров</li>
                    <li onClick={() => handleTabClick('settings')}>Общие</li>
                    <li onClick={() => handleTabClick('print_settings')}>Печать чека</li>
                    <li onClick={() => handleTabClick('marketing')}>Каналы продаж</li>
                    <li onClick={() => handleTabClick('square')}>Карта и зоны доставки</li>
                    <li onClick={() => handleTabClick('affiliates')}>Филиалы</li>
                    <li onClick={() => handleTabClick('point')}>Точки продаж</li>
                    <li onClick={() => handleTabClick('workshop')}>Типы цехов</li>
                </ul>
            </div>
            <div className="content">
                {selectedTab === 'payment' && <SettingsPaymentPage />} {/* Отображение компонента страницы */}
                {selectedTab === 'users' && <SettingsUsersPage />}
                {selectedTab === 'couriers' && <h2>Настройки доступа курьеров</h2>}
                {selectedTab === 'settings' && <SettingsGeneralPage />}
                {selectedTab === 'print_settings' && <PrintSettingsPage />}
                {selectedTab === 'marketing' && <SalesChannelsPage />}
                {selectedTab === 'square' && <h2>Карта и зоны доставки</h2>}
                {selectedTab === 'affiliates' && <BranchesPage />}
                {selectedTab === 'point' && <SalesPointsPage />}
                {selectedTab === 'workshop' && <WorkshopTypesPage />}
            </div>
        </div>
    );
}

export default SettingsPage;
