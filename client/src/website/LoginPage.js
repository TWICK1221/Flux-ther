import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
    const [username, setUsername] = useState(''); // Имя пользователя
    const [password, setPassword] = useState(''); // Пароль
    const [error, setError] = useState(''); // Ошибка авторизации
    const [loading, setLoading] = useState(false); // Состояние загрузки

    const handleLogin = async () => {
        // Проверка, что поля заполнены
        if (!username || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true); // Устанавливаем состояние загрузки
        setError(''); // Сбрасываем ошибку

        try {
            console.log('Отправка данных:', { username, password });

            // Отправка запроса на сервер
            const response = await axios.post('http://localhost:3001/api/website-auth/login', { username, password });
            console.log('Ответ сервера:', response.data);

            const { token } = response.data;

            // Сохранение токена в localStorage
            localStorage.setItem('token', token);

            // Перенаправление в приложение
            window.location.href = '/app/new-order';
        } catch (error) {
            console.error('Ошибка запроса:', error);

            // Отображение ошибки от сервера или стандартного сообщения
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Ошибка подключения к серверу');
            }
        } finally {
            setLoading(false); // Снимаем состояние загрузки
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Вход в приложение</h1>

            <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
            />

            <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Загрузка...' : 'Войти'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
