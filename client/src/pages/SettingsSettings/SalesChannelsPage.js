import React, { useState, useEffect } from 'react';
import './SalesChannelsPage.css';

const SalesChannelsPage = () => {
    const [channels, setChannels] = useState([]);
    const [newChannel, setNewChannel] = useState({
        name: '',
        type: '',
        description: '',
        integrationLink: '',
        isActive: true,
    });

    useEffect(() => {
        fetch('/api/SalesChannels')
            .then((response) => response.json())
            .then((data) => setChannels(data))
            .catch((error) => console.error('Ошибка загрузки данных:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewChannel((prevChannel) => ({
            ...prevChannel,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddChannel = () => {
        fetch('/api/SalesChannels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newChannel),
        })
            .then((response) => response.json())
            .then((data) => {
                setChannels((prevChannels) => [...prevChannels, data]);
                setNewChannel({ name: '', type: '', description: '', integrationLink: '', isActive: true });
            })
            .catch((error) => console.error('Ошибка добавления канала:', error));
    };

    const handleDeleteChannel = (id) => {
        fetch(`/api/SalesChannels/${id}`, {
            method: 'DELETE',
        })
            .then(() => setChannels((prevChannels) => prevChannels.filter((channel) => channel.id !== id)))
            .catch((error) => console.error('Ошибка удаления канала:', error));
    };

    return (
        <div className="sales-channels-page">
            <h2>Каналы продаж</h2>
            <div className="channels-list">
                {channels.map((channel) => (
                    <div key={channel.id} className="channel-item">
                        <h3>{channel.name}</h3>
                        <p><strong>Тип:</strong> {channel.type}</p>
                        <p><strong>Описание:</strong> {channel.description}</p>
                        <p><strong>Интеграция:</strong> {channel.integrationLink}</p>
                        <p><strong>Статус:</strong> {channel.isActive ? 'Активен' : 'Неактивен'}</p>
                        <button onClick={() => handleDeleteChannel(channel.id)}>Удалить</button>
                    </div>
                ))}
            </div>
            <div className="add-channel">
                <h3>Добавить новый канал</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Название"
                    value={newChannel.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Тип"
                    value={newChannel.type}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Описание"
                    value={newChannel.description}
                    onChange={handleInputChange}
                ></textarea>
                <input
                    type="text"
                    name="integrationLink"
                    placeholder="Ссылка для интеграции"
                    value={newChannel.integrationLink}
                    onChange={handleInputChange}
                />
                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={newChannel.isActive}
                        onChange={handleInputChange}
                    />
                    Активен
                </label>
                <button onClick={handleAddChannel}>Добавить</button>
            </div>
        </div>
    );
};

export default SalesChannelsPage;
