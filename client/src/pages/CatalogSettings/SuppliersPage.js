// Путь: FluxÆther/src/pages/SuppliersPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './SuppliersPage.css';

function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
        address: '',
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке поставщиков:', error);
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
            await api.post('/suppliers', formData);
            fetchSuppliers();
            setFormData({
                name: '',
                contactInfo: '',
                address: '',
            });
        } catch (error) {
            console.error('Ошибка при создании поставщика:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/suppliers/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Ошибка при удалении поставщика:', error);
        }
    };

    return (
        <div className="suppliers-page">
            <h1>Поставщики</h1>
            <form onSubmit={handleSubmit} className="supplier-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название поставщика"
                    required
                />
                <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Контактная информация"
                />
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Адрес"
                />
                <button type="submit">Добавить поставщика</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Контакт</th>
                        <th>Адрес</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contactInfo || '—'}</td>
                            <td>{supplier.address || '—'}</td>
                            <td>
                                <button onClick={() => handleDelete(supplier.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SuppliersPage;
