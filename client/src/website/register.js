// Путь: C:\1\Тест\client\src\website\register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Обработчик изменения данных формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/users/register', {
                username: formData.username,
                password: formData.password,
            });

            if (response.status === 200) {
                setMessage('Регистрация прошла успешно!');
                setError('');
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Произошла ошибка при регистрации.');
            setMessage('');
        }
    };

    return (
        <div className="register-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Логин:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Повторите пароль:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
