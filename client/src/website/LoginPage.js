import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const sanitizedUsername = DOMPurify.sanitize(username);
        const sanitizedPassword = DOMPurify.sanitize(password);

        if (!sanitizedUsername || !sanitizedPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (sanitizedPassword.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/api/website-auth/login', {
                username: sanitizedUsername,
                password: sanitizedPassword,
            });

            const { token } = response.data;
            const encryptedToken = CryptoJS.AES.encrypt(token, 'your-secret-key').toString();
            localStorage.setItem('token', encryptedToken);

            navigate('/app/new-order');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Ошибка сервера');
            } else if (error.request) {
                setError('Ошибка подключения к серверу');
            } else {
                setError('Ошибка при отправке запроса');
            }
        } finally {
            setLoading(false);
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
                    backgroundColor: loading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Загрузка...</span>
                        <div className="spinner" style={{ marginLeft: '10px' }}></div>
                    </div>
                ) : (
                    'Войти'
                )}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;