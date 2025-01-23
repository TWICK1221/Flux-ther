import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsEmployees.css';

function SettingsEmployees() {
    const [employees, setEmployees] = useState([]);
    const [searchPhone, setSearchPhone] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/employees');
            setEmployees(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
        }
    };

    const handleCreateOrUpdateEmployee = async () => {
        try {
            if (selectedEmployee?.id) {
                await axios.put(`/api/employees/${selectedEmployee.id}`, selectedEmployee);
            } else {
                await axios.post('/api/employees', selectedEmployee);
            }
            setIsModalOpen(false);
            setSelectedEmployee(null);
            fetchEmployees();
        } catch (error) {
            console.error('Ошибка при сохранении сотрудника:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`/api/employees/${id}`);
            fetchEmployees();
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.phone.includes(searchPhone)
    );

    return (
        <div className="settings-employees">
            <h2>Сотрудники</h2>
            <div className="actions">
                <button onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }}>Добавить сотрудника</button>
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
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                        <th>Должность</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr
                            key={employee.id}
                            className="employee-row"
                            onClick={() => { setSelectedEmployee(employee); setIsModalOpen(true); }}
                        >
                            <td>{employee.id}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.middleName}</td>
                            <td>{employee.position}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.email}</td>
                            <td
                                className="delete-icon"
                                onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(employee.id); }}
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
                        <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>{selectedEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h3>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={selectedEmployee?.firstName || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Фамилия"
                            value={selectedEmployee?.lastName || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Отчество"
                            value={selectedEmployee?.middleName || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, middleName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Должность"
                            value={selectedEmployee?.position || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Телефон"
                            value={selectedEmployee?.phone || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={selectedEmployee?.email || ''}
                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                        />
                        <div className="modal-actions">
                            <button onClick={handleCreateOrUpdateEmployee}>Сохранить</button>
                            {selectedEmployee?.id && <button onClick={() => handleDeleteEmployee(selectedEmployee.id)}>Удалить</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsEmployees;
