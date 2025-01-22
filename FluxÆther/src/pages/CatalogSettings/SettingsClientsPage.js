import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsClientsPage.css';
import PhoneInput from '../../components/PhoneInput';


function ClientsPage() {
    const [clients, setClients] = useState([]); // Список клиентов
    const [searchPhone, setSearchPhone] = useState(''); // Поиск по телефону
    const [sortField, setSortField] = useState(''); // Поле для сортировки
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [selectedClient, setSelectedClient] = useState(null); // Выбранный клиент
    const [clientDetails, setClientDetails] = useState({
        phone: '',
        name: '',
    });

    const handleOpenModal = (client = null) => {
        setSelectedClient(client);
        setClientDetails(client || {
            phone: '',
            name: '',
            street: '',
            house: '',
            flat: '',
            entrance: '',
            floor: '',
            comment: '',
        });
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/api/clients');
            console.log('Полученные данные:', response.data);
            setClients(response.data); // Предполагается, что response.data — это массив
        } catch (error) {
            console.error('Ошибка загрузки клиентов:', error);
            setClients([]); // Установите пустой массив в случае ошибки
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCreateOrUpdateClient = async () => {
        if (!clientDetails.name || !clientDetails.phone || !clientDetails.street || !clientDetails.house || !clientDetails.flat) {
            alert('Заполните все обязательные поля.');
            return;
        }

        // Обеспечиваем отправку всех полей, включая пустые
        const dataToSend = {
            name: clientDetails.name,
            phone: clientDetails.phone,
            street: clientDetails.street,
            house: clientDetails.house,
            flat: clientDetails.flat,
            entrance: clientDetails.entrance || '',
            floor: clientDetails.floor || '',
            comment: clientDetails.comment || '',
        };

        console.log('Отправляемые данные клиента:', dataToSend);

        try {
            const response = selectedClient?.id
                ? await axios.put(`/api/clients/${selectedClient.id}`, dataToSend, {
                    headers: { 'Content-Type': 'application/json' },
                })
                : await axios.post('/api/clients', dataToSend, {
                    headers: { 'Content-Type': 'application/json' },
                });

            alert('Клиент успешно сохранён!');
            setIsModalOpen(false);
            fetchClients();
        } catch (error) {
            console.error('Ошибка при сохранении клиента:', error.response?.data || error.message);
            alert('Не удалось сохранить клиента. Проверьте данные.');
        }
    };

    const handleDeleteClient = async (id) => {
        try {
            await axios.delete(`/api/clients/${id}`);
            fetchClients();
        } catch (error) {
            console.error('Ошибка при удалении клиента:', error);
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        const sortedClients = [...clients].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
        setClients(sortedClients);
    };

    if (!Array.isArray(clients)) {
        console.error('Ошибка: clients не является массивом', clients);
        return null;
    }

    const filteredClients = clients.filter((client) =>
        client.phone.includes(searchPhone)
    );

    const formatAddress = (client) => {
        const { street, house, flat, entrance, floor } = client;
        let address = `${street || ''}, д. ${house || ''}`;
        if (flat) address += `, кв. ${flat}`;
        if (entrance) address += `, подъезд ${entrance}`;
        if (floor) address += `, этаж ${floor}`;
        return address;
    };
   

    return (
        <div className="clients-page">
            <h2>Справочники → Клиенты</h2>
            <div className="actions">
                <button onClick={() => handleOpenModal(null)}>Добавить клиента</button>
                <input
                    type="text"
                    placeholder="Поиск по телефону"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('name')}>Имя</th>
                        <th onClick={() => handleSort('phone')}>Телефон</th>
                        <th onClick={() => handleSort('address')}>Адрес</th>
                        <th>Комментарий</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client) => (
                        <tr
                            key={client.id}
                            className="client-row"
                            onClick={() => handleOpenModal(client)}
                        >
                            <td>{client.id}</td>
                            <td>{client.name}</td>
                            <td>{client.phone}</td>
                            <td>{formatAddress(client)}</td>
                            <td>{client.comment}</td>
                            <td
                                className="delete-icon"
                                onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                            >
                                ❌
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsModalOpen(false)}>
                            &times;
                        </span>
                        <h3>{selectedClient?.id ? 'Редактировать клиента' : 'Добавить клиента'}</h3>
                        <input
                            type="text"
                            placeholder="Имя"
                            name="name"
                            value={clientDetails.name || ''}
                            onChange={handleInputChange}
                        />
                        <PhoneInput
                            value={clientDetails.phone || ''}
                            onChange={(e) => handleInputChange({ target: { name: 'phone', value: e.target.value } })}
                            placeholder="Введите номер телефона"
                        />
                        <input
                            type="text"
                            placeholder="Улица"
                            name="street"
                            value={clientDetails.street || ''}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            placeholder="Дом"
                            name="house"
                            value={clientDetails.house || ''}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="entrance"
                            placeholder="Подъезд"
                            value={clientDetails.entrance || ''}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="floor"
                            placeholder="Этаж"
                            value={clientDetails.floor || ''}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            placeholder="Квартира"
                            name="flat"
                            value={clientDetails.flat || ''}
                            onChange={handleInputChange}
                        />
                        <textarea
                            placeholder="Комментарий"
                            name="comment"
                            value={clientDetails.comment || ''}
                            onChange={handleInputChange}
                        />
                        <div className="modal-actions">
                            <button onClick={handleCreateOrUpdateClient}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientsPage;
