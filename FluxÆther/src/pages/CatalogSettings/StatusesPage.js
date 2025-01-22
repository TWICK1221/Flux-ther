// Путь: FluxÆther/src/pages/StatusesPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './StatusesPage.css';

function StatusesPage() {
    const [statuses, setStatuses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        isActive: true,
    });

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchStatuses = async () => {
        try {
            const response = await api.get('/statuses');
            setStatuses(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке статусов:', error);
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
            await api.post('/statuses', formData);
            fetchStatuses();
            setFormData({
                name: '',
                isActive: true,
            });
        } catch (error) {
            console.error('Ошибка при создании статуса:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/statuses/${id}`);
            fetchStatuses();
        } catch (error) {
            console.error('Ошибка при удалении статуса:', error);
        }
    };

    return (
        <div className="statuses-page">
            <h1>Статусы</h1>
            <form onSubmit={handleSubmit} className="status-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название статуса"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                    />
                    Активен
                </label>
                <button type="submit">Добавить статус</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Активен</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {statuses.map((status) => (
                        <tr key={status.id}>
                            <td>{status.id}</td>
                            <td>{status.name}</td>
                            <td>{status.isActive ? 'Да' : 'Нет'}</td>
                            <td>
                                <button onClick={() => handleDelete(status.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StatusesPage;
