// Путь: FluxÆther/src/pages/MarkupsPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './MarkupsPage.css';

function MarkupsPage() {
    const [markups, setMarkups] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        percentage: '',
        isActive: true,
    });

    useEffect(() => {
        fetchMarkups();
    }, []);

    const fetchMarkups = async () => {
        try {
            const response = await api.get('/markups');
            setMarkups(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке наценок:', error);
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
            await api.post('/markups', formData);
            fetchMarkups();
            setFormData({
                name: '',
                percentage: '',
                isActive: true,
            });
        } catch (error) {
            console.error('Ошибка при создании наценки:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/markups/${id}`);
            fetchMarkups();
        } catch (error) {
            console.error('Ошибка при удалении наценки:', error);
        }
    };

    return (
        <div className="markups-page">
            <h1>Наценки</h1>
            <form onSubmit={handleSubmit} className="markup-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название наценки"
                    required
                />
                <input
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="Процент наценки"
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
                <button type="submit">Добавить наценку</button>
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
                    {markups.map((markup) => (
                        <tr key={markup.id}>
                            <td>{markup.id}</td>
                            <td>{markup.name}</td>
                            <td>{markup.percentage}%</td>
                            <td>{markup.isActive ? 'Да' : 'Нет'}</td>
                            <td>
                                <button onClick={() => handleDelete(markup.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MarkupsPage;
