import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesPointsPage.css';

const SalesPointsPage = () => {
    const [salesPoints, setSalesPoints] = useState([]);
    const [newSalesPoint, setNewSalesPoint] = useState({
        name: '',
        address: '',
        phone: '',
        responsiblePerson: '',
        workingHours: '',
    });

    useEffect(() => {
        fetchSalesPoints();
    }, []);

    const fetchSalesPoints = async () => {
        try {
            const response = await axios.get('/api/salespoints');
            setSalesPoints(response.data);
        } catch (error) {
            console.error('Ошибка загрузки точек продаж:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSalesPoint({ ...newSalesPoint, [name]: value });
    };

    const handleAddSalesPoint = async () => {
        try {
            const response = await axios.post('/api/salespoints', newSalesPoint);
            setSalesPoints([...salesPoints, response.data]);
            setNewSalesPoint({
                name: '',
                address: '',
                phone: '',
                responsiblePerson: '',
                workingHours: '',
            });
        } catch (error) {
            console.error('Ошибка добавления точки продаж:', error);
        }
    };

    const handleUpdateSalesPoint = async (id, updatedSalesPoint) => {
        try {
            await axios.put(`/api/salespoints/${id}`, updatedSalesPoint);
            setSalesPoints(
                salesPoints.map((point) =>
                    point.id === id ? updatedSalesPoint : point
                )
            );
        } catch (error) {
            console.error('Ошибка обновления точки продаж:', error);
        }
    };

    const handleDeleteSalesPoint = async (id) => {
        try {
            await axios.delete(`/api/salespoints/${id}`);
            setSalesPoints(salesPoints.filter((point) => point.id !== id));
        } catch (error) {
            console.error('Ошибка удаления точки продаж:', error);
        }
    };

    return (
        <div className="sales-points-page">
            <h2>Управление точками продаж</h2>
            <div className="sales-points-list">
                {salesPoints.map((point) => (
                    <div key={point.id} className="sales-point-item">
                        <h3>{point.name}</h3>
                        <p>Адрес: {point.address}</p>
                        <p>Телефон: {point.phone}</p>
                        <p>Ответственное лицо: {point.responsiblePerson}</p>
                        <p>График работы: {point.workingHours}</p>
                        <button
                            onClick={() =>
                                handleUpdateSalesPoint(point.id, {
                                    ...point,
                                    name: prompt('Название точки продаж:', point.name) || point.name,
                                    address:
                                        prompt('Адрес точки продаж:', point.address) || point.address,
                                    phone: prompt('Телефон точки продаж:', point.phone) || point.phone,
                                    responsiblePerson:
                                        prompt('Ответственное лицо:', point.responsiblePerson) ||
                                        point.responsiblePerson,
                                    workingHours:
                                        prompt('График работы:', point.workingHours) ||
                                        point.workingHours,
                                })
                            }
                        >
                            Редактировать
                        </button>
                        <button onClick={() => handleDeleteSalesPoint(point.id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>

            <div className="add-sales-point-form">
                <h3>Добавить новую точку продаж</h3>
                <input
                    type="text"
                    name="name"
                    value={newSalesPoint.name}
                    onChange={handleInputChange}
                    placeholder="Название"
                />
                <input
                    type="text"
                    name="address"
                    value={newSalesPoint.address}
                    onChange={handleInputChange}
                    placeholder="Адрес"
                />
                <input
                    type="text"
                    name="phone"
                    value={newSalesPoint.phone}
                    onChange={handleInputChange}
                    placeholder="Телефон"
                />
                <input
                    type="text"
                    name="responsiblePerson"
                    value={newSalesPoint.responsiblePerson}
                    onChange={handleInputChange}
                    placeholder="Ответственное лицо"
                />
                <input
                    type="text"
                    name="workingHours"
                    value={newSalesPoint.workingHours}
                    onChange={handleInputChange}
                    placeholder="График работы"
                />
                <button onClick={handleAddSalesPoint}>Добавить точку</button>
            </div>
        </div>
    );
};

export default SalesPointsPage;
