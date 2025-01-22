import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsPaymentOptionsPage.css';

function SettingsPaymentOptionsPage() {
    const [paymentOptions, setPaymentOptions] = useState([]); // Список вариантов оплаты
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [selectedOption, setSelectedOption] = useState(null); // Выбранный вариант оплаты
    const [newPaymentOption, setNewPaymentOption] = useState(''); // Новый вариант оплаты

    useEffect(() => {
        fetchPaymentOptions();
    }, []);

    const fetchPaymentOptions = async () => {
        try {
            const response = await axios.get('/api/PaymentOptions'); // Запрос списка вариантов оплаты
            setPaymentOptions(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке вариантов оплаты:', error);
        }
    };

    const handleCreatePaymentOption = async () => {
        if (!newPaymentOption.trim()) {
            alert('Введите название варианта оплаты.');
            return;
        }

        try {
            await axios.post('/api/PaymentOptions', { name: newPaymentOption });
            setNewPaymentOption('');
            fetchPaymentOptions();
        } catch (error) {
            console.error('Ошибка при создании варианта оплаты:', error);
        }
    };

    const handleUpdatePaymentOption = async () => {
        if (!selectedOption?.name.trim()) {
            alert('Введите название варианта оплаты.');
            return;
        }

        try {
            await axios.put(`/api/PaymentOptions/${selectedOption.id}`, { name: selectedOption.name });
            setIsModalOpen(false);
            fetchPaymentOptions();
        } catch (error) {
            console.error('Ошибка при обновлении варианта оплаты:', error);
        }
    };

    const handleDeletePaymentOption = async (id) => {
        try {
            await axios.delete(`/api/PaymentOptions/${id}`);
            setIsModalOpen(false);
            fetchPaymentOptions();
        } catch (error) {
            console.error('Ошибка при удалении варианта оплаты:', error);
        }
    };

    return (
        <div className="PaymentOptions-page">
            <h2>Справочники → Варианты оплаты</h2>
            <div className="actions">
                <input
                    type="text"
                    placeholder="Введите название варианта оплаты"
                    value={newPaymentOption}
                    onChange={(e) => setNewPaymentOption(e.target.value)}
                />
                <button onClick={handleCreatePaymentOption}>Создать</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentOptions.map(option => (
                        <tr key={option.id}>
                            <td>{option.id}</td>
                            <td>{option.name}</td>
                            <td>
                                <button onClick={() => { setSelectedOption(option); setIsModalOpen(true); }}>Редактировать</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>Редактировать вариант оплаты</h3>
                        <input
                            type="text"
                            value={selectedOption?.name || ''}
                            onChange={(e) => setSelectedOption({ ...selectedOption, name: e.target.value })}
                        />
                        <div className="modal-actions">
                            <button onClick={handleUpdatePaymentOption}>Сохранить</button>
                            <button onClick={() => handleDeletePaymentOption(selectedOption.id)}>Удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsPaymentOptionsPage;
