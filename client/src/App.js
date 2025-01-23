import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header'; // Подключаем шапку

// Импортируем страницы
import NewOrderPage from './pages/NewOrderPage';
import OrdersPage from './pages/OrdersPage';
import CatalogPage from './pages/CatalogPage';
import StorePage from './pages/StorePage';
import CashPage from './pages/CashPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import EditOrderPage from './EditOrderPage';


function App() {
    return (
        <Router>
            <Header /> {/* Шапка с меню */}

            <div className="content">
                <Routes>
                    <Route path="/" element={<Navigate to="/new-order" replace />} />
                    <Route path="/new-order" element={<NewOrderPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/cash" element={<CashPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<div>Страница не найдена</div>} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/edit/:orderId" element={<EditOrderPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
