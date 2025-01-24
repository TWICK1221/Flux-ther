import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header"; // Подключаем шапку

// Импортируем страницы
import NewOrderPage from "./pages/NewOrderPage";
import OrdersPage from "./pages/OrdersPage";
import CatalogPage from "./pages/CatalogPage";
import StorePage from "./pages/StorePage";
import CashPage from "./pages/CashPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import EditOrderPage from "./EditOrderPage";
import HomePage from "./website/HomePage"; // Главная страница сайта
import LoginPage from "./website/LoginPage"; // Страница входа

function App() {
    // Проверка аутентификации
    const checkAuth = () => {
        const token = localStorage.getItem("token");
        return !!token; // Возвращает true, если токен существует, иначе false
    };

    useEffect(() => {
        const protectedRoutes = [
            "/app/new-order",
            "/app/orders",
            "/app/catalog",
            "/app/store",
            "/app/cash",
            "/app/stats",
            "/app/settings",
            "/app/orders/edit",
        ];

        const currentPath = window.location.pathname;
        if (protectedRoutes.some((route) => currentPath.startsWith(route)) && !checkAuth()) {
            window.location.href = "/site/login"; // Перенаправление на страницу входа
        }
    }, []);

    return (
        <Router>
            <div className="content">
                <Routes>
                    {/* Маршруты сайта */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/site/login" element={<LoginPage />} />

                    {/* Маршруты приложения */}
                    <Route
                        path="/app/*"
                        element={
                            checkAuth() ? (
                                <div>
                                    <Header /> {/* Шапка для приложения */}
                                    <Routes>
                                        <Route path="new-order" element={<NewOrderPage />} />
                                        <Route path="orders" element={<OrdersPage />} />
                                        <Route path="catalog" element={<CatalogPage />} />
                                        <Route path="store" element={<StorePage />} />
                                        <Route path="cash" element={<CashPage />} />
                                        <Route path="stats" element={<StatsPage />} />
                                        <Route path="settings" element={<SettingsPage />} />
                                        <Route path="orders/edit/:orderId" element={<EditOrderPage />} />
                                    </Routes>
                                </div>
                            ) : (
                                <Navigate to="/site/login" />
                            )
                        }
                    />

                    {/* Обработка неизвестных маршрутов */}
                    <Route path="*" element={<div>Страница не найдена</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
