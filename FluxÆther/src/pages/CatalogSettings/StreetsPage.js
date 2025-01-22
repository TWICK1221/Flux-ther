// Путь: FluxÆther/src/pages/StreetsPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './StreetsPage.css';

function StreetsPage() {
    const [streets, setStreets] = useState([]);
    const [formData, setFormData] = useState({
        streetName: '',
        house: '',
        entrance: '',
    });

    useEffect(() => {
        fetchStreets();
    }, []);

    const fetchStreets = async () => {
        try {
            const response = await api.get('/streets');
            setStreets(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке улиц:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/streets', formData);
            fetchStreets();
            setFormData({ streetName: '', house: '', entrance: '' });
        } catch (error) {
            console.error('Ошибка при создании улицы:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/streets/${id}`);
            fetchStreets();
        } catch (error) {
            console.error('Ошибка при удалении улицы:', error);
        }
    };

    return (
        <div className="streets-page">
            <h1>Улицы</h1>
            <form onSubmit={handleSubmit} className="street-form">
                <input
                    type="text"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    placeholder="Название улицы"
                    required
                />
                <input
                    type="text"
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    placeholder="Дом"
                />
                <input
                    type="text"
                    name="entrance"
                    value={formData.entrance}
                    onChange={handleInputChange}
                    placeholder="Подъезд"
                />
                <button type="submit">Добавить улицу</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Улица</th>
                        <th>Дом</th>
                        <th>Подъезд</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {streets.map((street) => (
                        <tr key={street.id}>
                            <td>{street.id}</td>
                            <td>{street.streetName}</td>
                            <td>{street.house || '—'}</td>
                            <td>{street.entrance || '—'}</td>
                            <td>
                                <button onClick={() => handleDelete(street.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StreetsPage;
