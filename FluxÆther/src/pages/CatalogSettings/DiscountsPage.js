// Путь: FluxÆther/src/pages/DiscountsPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './DiscountsPage.css';

function DiscountsPage() {
    const [discounts, setDiscounts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        percentage: '',
        isActive: true,
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const response = await api.get('/discounts');
            setDiscounts(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке скидок:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/discounts', formData);
            fetchDiscounts();
            setFormData({
                name: '',
                percentage: '',
                isActive: true,
            });
        } catch (error) {
            console.error('Ошибка при создании скидки:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/discounts/${id}`);
            fetchDiscounts();
        } catch (error) {
            console.error('Ошибка при удалении скидки:', error);
        }
    };

    return (
        <div className="discounts-page">
            <h1>Скидки</h1>
            <form onSubmit={handleSubmit} className="discount-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название скидки"
                    required
                />
                <input
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="Процент скидки"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                    />
                    Активна
                </label>
                <button type="submit">Добавить скидку</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Процент</th>
                        <th>Активна</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((discount) => (
                        <tr key={discount.id}>
                            <td>{discount.id}</td>
                            <td>{discount.name}</td>
                            <td>{discount.percentage}%</td>
                            <td>{discount.isActive ? 'Да' : 'Нет'}</td>
                            <td>
                                <button onClick={() => handleDelete(discount.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DiscountsPage;
