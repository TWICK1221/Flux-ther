// Путь: FluxÆther/src/pages/CertificatesPage.js
import React, { useState, useEffect } from 'react';
import { api } from "../../api";
import './CertificatesPage.css';

function CertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        isForSpecificProduct: false,
        productId: '',
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates');
            setCertificates(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке сертификатов:', error);
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
            await api.post('/certificates', formData);
            fetchCertificates();
            setFormData({
                name: '',
                amount: '',
                isForSpecificProduct: false,
                productId: '',
            });
        } catch (error) {
            console.error('Ошибка при создании сертификата:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/certificates/${id}`);
            fetchCertificates();
        } catch (error) {
            console.error('Ошибка при удалении сертификата:', error);
        }
    };

    return (
        <div className="certificates-page">
            <h1>Сертификаты</h1>
            <form onSubmit={handleSubmit} className="certificate-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Название сертификата"
                    required
                />
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Номинал"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="isForSpecificProduct"
                        checked={formData.isForSpecificProduct}
                        onChange={handleInputChange}
                    />
                    Привязан к товару
                </label>
                {formData.isForSpecificProduct && (
                    <input
                        type="number"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        placeholder="ID товара"
                    />
                )}
                <button type="submit">Добавить сертификат</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Номинал</th>
                        <th>Привязан к товару</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map((certificate) => (
                        <tr key={certificate.id}>
                            <td>{certificate.id}</td>
                            <td>{certificate.name}</td>
                            <td>{certificate.amount}</td>
                            <td>{certificate.isForSpecificProduct ? 'Да' : 'Нет'}</td>
                            <td>
                                <button onClick={() => handleDelete(certificate.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CertificatesPage;
