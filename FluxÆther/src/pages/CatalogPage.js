// src/pages/CatalogPage.js
import React, { useState } from 'react';
import '../assets/styles/styles.css'; // Импорт стилей
import '../assets/styles/CatalogPage.css'; // Импорт стилей
import SettingsProducts from './CatalogSettings/SettingsProducts';
import SettingsCategories from './CatalogSettings/SettingsCategories';
import SettingsComponents from './CatalogSettings/SettingsComponents';
import SettingsClientsPage from './CatalogSettings/SettingsClientsPage';
import SettingsEmployees from './CatalogSettings/SettingsEmployees';
import SettingsPaymentOptionsPage from './CatalogSettings/SettingsPaymentOptionsPage';
import SchedulePage from './CatalogSettings/SchedulePage';
import CertificatesPage from './CatalogSettings/CertificatesPage';
import DiscountsPage from './CatalogSettings/DiscountsPage';
import MarkupsPage from './CatalogSettings/MarkupsPage';
import StatusesPage from './CatalogSettings/StatusesPage';
import OrderTagsPage from './CatalogSettings/OrderTagsPage';
import SuppliersPage from './CatalogSettings/SuppliersPage';
import WriteOffReasonsPage from './CatalogSettings/WriteOffReasonsPage'
import UnitsOfMeasurementPage from './CatalogSettings/UnitsOfMeasurementPage'
import StreetsPage from './CatalogSettings/StreetsPage'


function SettingsPage() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    
    const menuItems = [
        { label: 'Категории', component: <SettingsCategories /> },
        { label: 'Товары', component: <SettingsProducts /> },
        { label: 'Компоненты (сырье)', component: <SettingsComponents /> },
        { label: 'Клиенты', component: <SettingsClientsPage /> },
        { label: 'Сотрудники', component: <SettingsEmployees /> },
        { label: 'График смен', component: <SchedulePage /> },
        { label: 'Сертификаты', component: <CertificatesPage /> },
        { label: 'Скидки', component: <DiscountsPage /> },
        { label: 'Наценки', component: <MarkupsPage /> },
        { label: 'Статусы', component: <StatusesPage /> },
        { label: 'Отметки заказов', component: <OrderTagsPage /> },
        { label: 'Варианты оплаты', component: <SettingsPaymentOptionsPage /> },
        { label: 'Поставщики', component: <SuppliersPage  /> },
        { label: 'Причины списания', component: <WriteOffReasonsPage  /> },
        { label: 'Единицы измерения', component: <UnitsOfMeasurementPage /> },
        { label: 'Улицы', component: <StreetsPage /> },
        { label: 'Должности', component: <div>Настройки для Должностей</div> },
    ];

    const handleMenuClick = (item) => {
        setSelectedMenuItem(item);
    };

    const renderContent = () => {
        const menuItem = menuItems.find((menu) => menu.label === selectedMenuItem);
        return menuItem ? menuItem.component : <div>Выберите пункт из меню</div>;
    };

    return (
        <div className="settings-page-CatalogPage">
            <div className="menu">
                <ul>
                    {menuItems.map((menu) => (
                        <li key={menu.label} onClick={() => handleMenuClick(menu.label)}>
                            {menu.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content">
                {renderContent()} {/* Выводим содержимое в зависимости от выбранного пункта меню */}
            </div>
        </div>
    );
}

export default SettingsPage;
