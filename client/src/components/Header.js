import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Header.css'; // Импорт стилей






function Header() {
    return (
        <header className="header">
            <nav className="header-menu">
                <ul>
                    <li>
                        <Link to="/app/new-order">
                            <div className="icon-button">
                                <img
                                    src={require('../assets/icons/plus.svg').default}
                                    alt="plus"

                                />
                            </div>
                            <span className="icon-label">Новый заказ</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/orders">
                            <img
                                src={require('../assets/icons/bars.svg').default}
                                alt="bars"
                                className="icon-button"
                            />
                            <span className="icon-label">Заказы</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/catalog">
                            <img
                                src={require('../assets/icons/book.svg').default}
                                alt="book"
                                className="icon-button"
                            />
                            <span className="icon-label">Справочники</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/store">
                            <img
                                src={require('../assets/icons/store.svg').default}
                                alt="store"
                                className="icon-button"
                            />
                            <span className="icon-label">Склад</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/cash">
                            <img
                                src={require('../assets/icons/money.svg').default}
                                alt="money"
                                className="icon-button"
                            />
                            <span className="icon-label">Деньги</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/stats">
                            <img
                                src={require('../assets/icons/stats.svg').default}
                                alt="stats"
                                className="icon-button"
                            />
                            <span className="icon-label">Статистика</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/settings">
                            <img
                                src={require('../assets/icons/setting.svg').default}
                                alt="setting"
                                className="icon-button"
                            />
                            <span className="icon-label">Настройки</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="header-actions">
                <button className="action-button">Помощь</button>
                <button className="action-button">Выйти</button>
            </div>
        </header>
    );
}

export default Header;