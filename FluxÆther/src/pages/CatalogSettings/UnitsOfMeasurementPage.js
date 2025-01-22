// Путь: FluxÆther/src/pages/UnitsOfMeasurementPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './UnitsOfMeasurementPage.css';

function UnitsOfMeasurementPage() {
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchUnitsOfMeasurement();
    }, []);

    const fetchUnitsOfMeasurement = async () => {
        try {
            const response = await api.get('/unitsofmeasurement');
            setUnits(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке единиц измерения:', error);
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
            await api.post('/unitsofmeasurement', formData);
            fetchUnitsOfMeasurement();
            setFormData({
                name: '',
                description: '',
            });
        } catch (error) {
            console.error('Ошибка при создании единицы измерения:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/unitsofmeasurement/${id}`);
            fetchUnitsOfMeasurement();
        } catch (error) {
            console.error('Ошибка при удалении единицы измерения:', error);
        }
    };

    return (
        <div className="units-page">
            <h1>Единицы измерения</h1>
            <form onSubmit={handleSubmit} className="unit-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название единицы измерения"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Описание (необязательно)"
                ></textarea>
                <button type="submit">Добавить единицу</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((unit) => (
                        <tr key={unit.id}>
                            <td>{unit.id}</td>
                            <td>{unit.name}</td>
                            <td>{unit.description || '—'}</td>
                            <td>
                                <button onClick={() => handleDelete(unit.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UnitsOfMeasurementPage;
