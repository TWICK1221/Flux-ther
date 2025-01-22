import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WorkshopTypesPage.css';

const WorkshopTypesPage = () => {
    const [workshopTypes, setWorkshopTypes] = useState([]);
    const [newWorkshopType, setNewWorkshopType] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchWorkshopTypes();
    }, []);

    const fetchWorkshopTypes = async () => {
        try {
            const response = await axios.get('/api/workshoptypes');
            setWorkshopTypes(response.data);
        } catch (error) {
            console.error('Ошибка загрузки типов цехов:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkshopType({ ...newWorkshopType, [name]: value });
    };

    const handleAddWorkshopType = async () => {
        try {
            const response = await axios.post('/api/workshoptypes', newWorkshopType);
            setWorkshopTypes([...workshopTypes, response.data]);
            setNewWorkshopType({ name: '', description: '' });
        } catch (error) {
            console.error('Ошибка добавления типа цеха:', error);
        }
    };

    const handleUpdateWorkshopType = async (id, updatedWorkshopType) => {
        try {
            await axios.put(`/api/workshoptypes/${id}`, updatedWorkshopType);
            setWorkshopTypes(
                workshopTypes.map((type) =>
                    type.id === id ? updatedWorkshopType : type
                )
            );
        } catch (error) {
            console.error('Ошибка обновления типа цеха:', error);
        }
    };

    const handleDeleteWorkshopType = async (id) => {
        try {
            await axios.delete(`/api/workshoptypes/${id}`);
            setWorkshopTypes(workshopTypes.filter((type) => type.id !== id));
        } catch (error) {
            console.error('Ошибка удаления типа цеха:', error);
        }
    };

    return (
        <div className="workshop-types-page">
            <h2>Типы цехов</h2>
            <div className="workshop-types-list">
                {workshopTypes.map((type) => (
                    <div key={type.id} className="workshop-type-item">
                        <h3>{type.name}</h3>
                        <p>{type.description}</p>
                        <button
                            onClick={() =>
                                handleUpdateWorkshopType(type.id, {
                                    ...type,
                                    name: prompt('Название типа цеха:', type.name) || type.name,
                                    description:
                                        prompt('Описание типа цеха:', type.description) ||
                                        type.description,
                                })
                            }
                        >
                            Редактировать
                        </button>
                        <button onClick={() => handleDeleteWorkshopType(type.id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>

            <div className="add-workshop-type-form">
                <h3>Добавить новый тип цеха</h3>
                <input
                    type="text"
                    name="name"
                    value={newWorkshopType.name}
                    onChange={handleInputChange}
                    placeholder="Название"
                />
                <input
                    type="text"
                    name="description"
                    value={newWorkshopType.description}
                    onChange={handleInputChange}
                    placeholder="Описание"
                />
                <button onClick={handleAddWorkshopType}>Добавить тип цеха</button>
            </div>
        </div>
    );
};

export default WorkshopTypesPage;
