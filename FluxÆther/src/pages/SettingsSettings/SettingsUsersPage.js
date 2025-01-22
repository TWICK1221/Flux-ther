import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsUsersPage.css';

const SettingsUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        id: 0,
        name: '',
        email: '',
        password: '',
        role: 'Пользователь',
    });
    const [isEditing, setIsEditing] = useState(false);

    // Получение пользователей из API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/Users');
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    // Обработка изменений в полях ввода
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Добавление или обновление пользователя
    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/Users/${newUser.id}`, newUser);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === newUser.id ? newUser : user
                    )
                );
            } else {
                const response = await axios.post('/api/Users', newUser);
                setUsers((prevUsers) => [...prevUsers, response.data]);
            }
            setNewUser({
                id: 0,
                name: '',
                email: '',
                password: '',
                role: 'Пользователь',
            });
            setIsEditing(false);
        } catch (error) {
            console.error(
                isEditing
                    ? 'Ошибка обновления пользователя:'
                    : 'Ошибка добавления пользователя:',
                error
            );
        }
    };

    // Удаление пользователя
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`/api/Users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
        }
    };

    // Подготовка пользователя к редактированию
    const handleEditUser = (user) => {
        setNewUser(user);
        setIsEditing(true);
    };

    return (
        <div className="settings-users-page">
            <h2 className="settings-users-title">Настройки пользователей</h2>
            <form
                className="settings-users-form"
                onSubmit={handleAddOrUpdateUser}
            >
                <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    placeholder="Имя"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Пароль"
                    required={!isEditing} // Пароль обязателен только при добавлении
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                >
                    <option value="Пользователь">Пользователь</option>
                    <option value="Менеджер">Менеджер</option>
                    <option value="Администратор">Администратор</option>
                </select>
                <button type="submit">
                    {isEditing ? 'Обновить' : 'Добавить'}
                </button>
            </form>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)}>
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SettingsUsersPage;
