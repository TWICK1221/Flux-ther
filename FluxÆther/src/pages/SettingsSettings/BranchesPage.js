//Филиалы
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BranchesPage.css';

const BranchesPage = () => {
    const [branches, setBranches] = useState([]);
    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: '',
        workingHours: '',
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('/api/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Ошибка загрузки филиалов:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch({ ...newBranch, [name]: value });
    };

    const handleAddBranch = async () => {
        try {
            const response = await axios.post('/api/branches', newBranch);
            setBranches([...branches, response.data]);
            setNewBranch({ name: '', address: '', phone: '', workingHours: '' });
        } catch (error) {
            console.error('Ошибка добавления филиала:', error);
        }
    };

    const handleUpdateBranch = async (id, updatedBranch) => {
        try {
            await axios.put(`/api/branches/${id}`, updatedBranch);
            setBranches(
                branches.map((branch) => (branch.id === id ? updatedBranch : branch))
            );
        } catch (error) {
            console.error('Ошибка обновления филиала:', error);
        }
    };

    const handleDeleteBranch = async (id) => {
        try {
            await axios.delete(`/api/branches/${id}`);
            setBranches(branches.filter((branch) => branch.id !== id));
        } catch (error) {
            console.error('Ошибка удаления филиала:', error);
        }
    };

    return (
        <div className="branches-page">
            <h2>Управление филиалами</h2>
            <div className="branches-list">
                {branches.map((branch) => (
                    <div key={branch.id} className="branch-item">
                        <h3>{branch.name}</h3>
                        <p>Адрес: {branch.address}</p>
                        <p>Телефон: {branch.phone}</p>
                        <p>График работы: {branch.workingHours}</p>
                        <button
                            onClick={() =>
                                handleUpdateBranch(branch.id, {
                                    ...branch,
                                    name: prompt('Название филиала:', branch.name) || branch.name,
                                    address:
                                        prompt('Адрес филиала:', branch.address) || branch.address,
                                    phone: prompt('Телефон филиала:', branch.phone) || branch.phone,
                                    workingHours:
                                        prompt(
                                            'График работы филиала:',
                                            branch.workingHours
                                        ) || branch.workingHours,
                                })
                            }
                        >
                            Редактировать
                        </button>
                        <button onClick={() => handleDeleteBranch(branch.id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>

            <div className="add-branch-form">
                <h3>Добавить новый филиал</h3>
                <input
                    type="text"
                    name="name"
                    value={newBranch.name}
                    onChange={handleInputChange}
                    placeholder="Название"
                />
                <input
                    type="text"
                    name="address"
                    value={newBranch.address}
                    onChange={handleInputChange}
                    placeholder="Адрес"
                />
                <input
                    type="text"
                    name="phone"
                    value={newBranch.phone}
                    onChange={handleInputChange}
                    placeholder="Телефон"
                />
                <input
                    type="text"
                    name="workingHours"
                    value={newBranch.workingHours}
                    onChange={handleInputChange}
                    placeholder="График работы"
                />
                <button onClick={handleAddBranch}>Добавить филиал</button>
            </div>
        </div>
    );
};

export default BranchesPage;
