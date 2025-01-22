// Путь: FluxÆther/src/pages/OrderTagsPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './OrderTagsPage.css';

function OrderTagsPage() {
    const [tags, setTags] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000',
    });

    useEffect(() => {
        fetchOrderTags();
    }, []);

    const fetchOrderTags = async () => {
        try {
            const response = await api.get('/ordertags');
            setTags(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке отметок:', error);
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
            await api.post('/ordertags', formData);
            fetchOrderTags();
            setFormData({
                name: '',
                color: '#000000',
            });
        } catch (error) {
            console.error('Ошибка при создании отметки:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/ordertags/${id}`);
            fetchOrderTags();
        } catch (error) {
            console.error('Ошибка при удалении отметки:', error);
        }
    };

    return (
        <div className="order-tags-page">
            <h1>Отметки заказов</h1>
            <form onSubmit={handleSubmit} className="tag-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название отметки"
                    required
                />
                <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                />
                <button type="submit">Добавить отметку</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Цвет</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag) => (
                        <tr key={tag.id}>
                            <td>{tag.id}</td>
                            <td>{tag.name}</td>
                            <td>
                                <div
                                    style={{
                                        backgroundColor: tag.color,
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                    }}
                                ></div>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(tag.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderTagsPage;
