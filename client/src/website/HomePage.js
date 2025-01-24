import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Добро пожаловать на сайт</h1>
            <p>Это главная страница сайта.</p>
            <Link to="/site/login">Войти в приложение</Link>
        </div>
    );
}

export default HomePage;