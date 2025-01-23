// Путь: FluxÆther/src/pages/WriteOffReasonsPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './WriteOffReasonsPage.css';

function WriteOffReasonsPage() {
    const [reasons, setReasons] = useState([]);
    const [formData, setFormData] = useState({
        reason: '',
        description: '',
    });

    useEffect(() => {
        fetchWriteOffReasons();
    }, []);

    const fetchWriteOffReasons = async () => {
        try {
            const response = await api.get('/writeoffreasons');
            setReasons(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке причин списания:', error);
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
            await api.post('/writeoffreasons', formData);
            fetchWriteOffReasons();
            setFormData({
                reason: '',
                description: '',
            });
        } catch (error) {
            console.error('Ошибка при создании причины списания:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/writeoffreasons/${id}`);
            fetchWriteOffReasons();
        } catch (error) {
            console.error('Ошибка при удалении причины списания:', error);
        }
    };

    return (
        <div className="writeoff-reasons-page">
            <h1>Причины списания</h1>
            <form onSubmit={handleSubmit} className="reason-form">
                <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Причина списания"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Описание (необязательно)"
                ></textarea>
                <button type="submit">Добавить причину</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Причина</th>
                        <th>Описание</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {reasons.map((reason) => (
                        <tr key={reason.id}>
                            <td>{reason.id}</td>
                            <td>{reason.reason}</td>
                            <td>{reason.description || '—'}</td>
                            <td>
                                <button onClick={() => handleDelete(reason.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WriteOffReasonsPage;
