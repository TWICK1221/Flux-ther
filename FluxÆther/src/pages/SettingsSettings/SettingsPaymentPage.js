import React, { useState } from 'react';
import './SettingsPaymentPage.css';

const SettingsPaymentPage = () => {
    const [formData, setFormData] = useState({
        accountNumber: '',
        tariffPlan: 'basic',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Сохраненные данные:', formData);
        alert('Настройки успешно сохранены!');
    };

    const handleReset = () => {
        setFormData({
            accountNumber: '',
            tariffPlan: 'basic',
        });
    };

    return (
        <div className="settings-payment-page">
            <h2 className="settings-payment-title">Настройки лицевого счета и тарифа</h2>
            <div className="settings-payment-content">
                <p className="settings-description">
                    Здесь вы можете настроить параметры лицевого счета и тарифы для вашего аккаунта. Пожалуйста, заполните необходимые поля и сохраните изменения.
                </p>
                <form
                    className="settings-payment-form"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                >
                    <div className="form-group">
                        <label htmlFor="account-number">Номер лицевого счета:</label>
                        <input
                            type="text"
                            id="account-number"
                            name="accountNumber"
                            className="form-control"
                            placeholder="Введите номер лицевого счета"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tariff-plan">Выберите тарифный план:</label>
                        <select
                            id="tariff-plan"
                            name="tariffPlan"
                            className="form-control"
                            value={formData.tariffPlan}
                            onChange={handleInputChange}
                        >
                            <option value="basic">Базовый</option>
                            <option value="standard">Стандартный</option>
                            <option value="premium">Премиум</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            Сохранить
                        </button>
                        <button type="reset" className="btn-cancel">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPaymentPage;
