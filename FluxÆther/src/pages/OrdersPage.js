import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import '../assets/styles/OrdersPage.css'; // Импорт стилей

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode") || "list");
    const [filter, setFilter] = useState("today"); // "today", "yesterday", "range"
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [stats, setStats] = useState({ totalOrders: 0, averageOrder: 0, totalRevenue: 0 });
    const [dropdownOpen, setDropdownOpen] = useState(false); // Управление открытием фильтра
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
        fetchPaymentOptions();
    }, []);

    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        applyFilter();
    }, [filter, dateRange, orders]);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            const ordersData = response.data || [];

            const enrichedOrders = await Promise.all(
                ordersData.map(async (order) => {
                    try {
                        const detailsResponse = await api.get(`/orders/${order.orderId}`);
                        const detailsData = detailsResponse.data;

                        return {
                            ...order,
                            client: {
                                name: detailsData.client?.name || "Имя отсутствует",
                                phone: detailsData.client?.phone || "Телефон отсутствует",
                                street: detailsData.client?.street || "Улица отсутствует",
                                house: detailsData.client?.house || "Дом отсутствует",
                                entrance: detailsData.client?.entrance || "",
                                floor: detailsData.client?.floor || "",
                                flat: detailsData.client?.flat || "",
                            },
                            items: detailsData.items || [],
                            totalAmount: detailsData.totalAmount || order.totalAmount,
                            paymentMethod: detailsData.paymentOption || order.paymentMethod,
                        };
                    } catch (detailsError) {
                        console.error(`Ошибка при загрузке деталей заказа ${order.orderId}:`, detailsError.message);
                        return order;
                    }
                })
            );

            setOrders(enrichedOrders);
            setFilteredOrders(enrichedOrders);
        } catch (error) {
            console.error("Ошибка при загрузке заказов:", error.message);
        }
    };

    const fetchPaymentOptions = async () => {
        try {
            const response = await api.get("/PaymentOptions");
            setPaymentOptions(response.data || []);
        } catch (error) {
            console.error("Ошибка при загрузке вариантов оплаты:", error.message);
        }
    };

    const applyFilter = () => {
        let filtered = orders;

        if (filter === "today") {
            const today = new Date();
            filtered = orders.filter((order) => {
                const orderDate = new Date(order.orderDate);
                return orderDate.toDateString() === today.toDateString();
            });
        } else if (filter === "yesterday") {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            filtered = orders.filter((order) => {
                const orderDate = new Date(order.orderDate);
                return orderDate.toDateString() === yesterday.toDateString();
            });
        } else if (filter === "range") {
            const { start, end } = dateRange;

            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                endDate.setHours(23, 59, 59, 999);

                filtered = orders.filter((order) => {
                    const orderDate = new Date(order.orderDate);
                    return orderDate >= startDate && orderDate <= endDate;
                });
            }
        }

        setFilteredOrders(filtered);
        calculateStats(filtered);
    };

    const calculateStats = (filteredOrders) => {
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
            totalOrders,
            totalRevenue,
            averageOrder: averageOrder.toFixed(2),
        });
    };

    const handleDateRangeChange = (field, value) => {
        setDateRange((prev) => ({ ...prev, [field]: value }));
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await api.delete(`/orders/${orderId}`);

            if (response.status === 200) {
                setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
                console.log(`Заказ с ID ${orderId} успешно удален.`);
            } else {
                console.error(`Ошибка при удалении заказа: ${response.data}`);
            }
        } catch (error) {
            console.error(`Ошибка при удалении заказа с ID ${orderId}:`, error.message);
        }
    };

    const handlePaymentChange = async (orderId, newPaymentOptionName) => {
        try {
            const selectedOption = paymentOptions.find((option) => option.name === newPaymentOptionName);
            if (!selectedOption) {
                console.error("Вариант оплаты не найден:", newPaymentOptionName);
                return;
            }

            const orderResponse = await api.get(`/orders/${orderId}`);
            const orderData = orderResponse.data;

            if (!orderData) {
                console.error("Ошибка: данные заказа не найдены");
                return;
            }

            const updatedOrder = {
                clientName: orderData.client?.name || "Имя отсутствует",
                clientPhone: orderData.client?.phone || "Телефон отсутствует",
                clientStreet: orderData.client?.street || "Улица отсутствует",
                clientHouse: orderData.client?.house || "Дом отсутствует",
                clientEntrance: orderData.client?.entrance || "",
                clientFloor: orderData.client?.floor || "",
                clientFlat: orderData.client?.flat || "",
                paymentOption: selectedOption.name,
                items: orderData.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName || "Без названия",
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: orderData.totalAmount,
            };

            const response = await api.put(`/orders/${orderId}`, updatedOrder);

            if (response.status === 200) {
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.orderId === orderId
                            ? {
                                ...o,
                                paymentMethod: selectedOption.name,
                                client: {
                                    name: updatedOrder.clientName,
                                    phone: updatedOrder.clientPhone,
                                    street: updatedOrder.clientStreet,
                                    house: updatedOrder.clientHouse,
                                    entrance: updatedOrder.clientEntrance,
                                    floor: updatedOrder.clientFloor,
                                    flat: updatedOrder.clientFlat,
                                },
                                items: updatedOrder.items,
                            }
                            : o
                    )
                );
            }
        } catch (error) {
            console.error("Ошибка при обновлении способа оплаты:", error.message);
        }
    };

    const renderFilters = () => (
        <div className="filters">
            <div className="single-button-dropdown">
                <div className="filters-container">
                    <div className="dropdown-filter">
                        <button
                            className="btn dropdown-toggle"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {filter === "today"
                                ? "Сегодня"
                                : filter === "yesterday"
                                    ? "Вчера"
                                    : `С ${dateRange.start || "дд.мм.гггг"} по ${dateRange.end || "дд.мм.гггг"}`}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button
                                    className={`dropdown-item ${filter === "today" ? "active" : ""}`}
                                    onClick={() => {
                                        setFilter("today");
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Сегодня
                                </button>
                                <button
                                    className={`dropdown-item ${filter === "yesterday" ? "active" : ""}`}
                                    onClick={() => {
                                        setFilter("yesterday");
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Вчера
                                </button>
                                <div className="date-range">
                                    <label>
                                        Начало:
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => handleDateRangeChange("start", e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Конец:
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => handleDateRangeChange("end", e.target.value)}
                                        />
                                    </label>
                                    <button
                                        className="btn apply-btn"
                                        onClick={() => {
                                            setFilter("range");
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Применить
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="order-statistics">
                        <p>Всего заказов: {stats.totalOrders}</p>
                        <p>Общая сумма: {stats.totalRevenue} руб.</p>
                        <p>Средний чек: {stats.averageOrder} руб.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrdersList = () => (
        <table className="orders-table">
            <tbody id="orders_content">
                {filteredOrders.map((order) => {
                    const parsedAddress = `
                        ${order.client?.street || "Улица отсутствует"}, 
                        ${order.client?.house || "Дом отсутствует"}
                        ${order.client?.entrance ? `, Подъезд ${order.client.entrance}` : ""}
                        ${order.client?.floor ? `, Этаж ${order.client.floor}` : ""}
                        ${order.client?.flat ? `, Квартира ${order.client.flat}` : ""}
                    `.trim();

                    return (
                        <React.Fragment key={order.orderId}>
                            <tr className="tr_order_head">
                                <td colSpan="6">
                                    <div className="order-header">
                                        <span className="order_datetime">
                                            {new Date(order.orderDate).toLocaleString("ru-RU")} (№ {order.orderId})
                                        </span>
                                        <div className="order-actions">
                                            <button
                                                className="btn grey"
                                                onClick={() => navigate(`/orders/edit/${order.orderId}`)}
                                            >
                                                Изменить
                                            </button>
                                            <button className="btn grey" onClick={() => console.log("Печать заказа")}>
                                                Печать
                                            </button>
                                            <button
                                                className="btn grey"
                                                onClick={() => handleDeleteOrder(order.orderId)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="tr_order_body">
                                <td>
                                    <div className="items-list">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="item-row">
                                                <span>{item.productName || "Название отсутствует"}</span>
                                                <span>{item.quantity} шт.</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>{order.totalAmount} руб.</td>
                                <td>
                                    <select
                                        value={order.paymentMethod || ""}
                                        onChange={(e) => handlePaymentChange(order.orderId, e.target.value)}
                                    >
                                        {paymentOptions.map((option) => (
                                            <option key={option.id} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>{parsedAddress}</td>
                                <td>{order.client?.phone || "Не указано"}</td>
                            </tr>
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <div className="orders-page">
            <div className="view-switcher">
                
            </div>
            
            {renderFilters()}
            {renderOrdersList()}
        </div>
    );
}

export default OrdersPage;
