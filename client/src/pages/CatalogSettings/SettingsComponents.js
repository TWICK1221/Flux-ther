import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './SettingsComponents.css';

function SettingsComponents() {
    const [components, setComponents] = useState([]); // Список компонентов
    const [rawMaterials, setRawMaterials] = useState([]); // Список сырья
    const [newComponent, setNewComponent] = useState({ name: '', description: '', rawMaterialIds: [] }); // Новый компонент
    const [newRawMaterial, setNewRawMaterial] = useState({ name: '', quantity: 0 }); // Новое сырье
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [activeTab, setActiveTab] = useState('component'); // Активная вкладка ("component" или "rawMaterial")
    const [selectedItem, setSelectedItem] = useState(null); // Выбранный элемент для редактирования

    useEffect(() => {
        fetchComponents();
        fetchRawMaterials();
    }, []);

    const fetchComponents = async () => {
        try {
            const response = await axios.get('/api/components?includeRawMaterials=true'); // Запрашиваем компоненты с сырьем
            setComponents(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке компонентов:', error);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get('/api/RawMaterials');
            setRawMaterials(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке сырья:', error);
        }
    };

    const handleCreateComponent = async () => {
        try {
            const response = await axios.post('/api/components', newComponent, {
                headers: { 'Content-Type': 'application/json' },
            });
            setComponents([...components, response.data]);
            setNewComponent({ name: '', description: '', rawMaterialIds: [] });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Ошибка при создании компонента:', error);
        }
    };

    const handleCreateRawMaterial = async () => {
        try {
            const response = await axios.post('/api/RawMaterials', newRawMaterial, {
                headers: { 'Content-Type': 'application/json' },
            });
            setRawMaterials([...rawMaterials, response.data]);
            setNewRawMaterial({ name: '', quantity: 0 });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Ошибка при создании сырья:', error);
        }
    };

    const openEditModal = (item, type) => {
        setActiveTab(type);

        if (type === 'component') {
            setSelectedItem({
                id: item.id,
                name: item.name,
                description: item.description || '',
                rawMaterialIds: item.rawMaterials?.map(r => r.id) || [],
            });
        } else {
            setSelectedItem({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
            });
        }

        setIsModalOpen(true);
    };

    const handleEdit = async () => {
        if (!selectedItem) return;

        const updatedItem = activeTab === 'component' ? {
            id: selectedItem.id,
            name: selectedItem.name || '',
            description: selectedItem.description || '',
            rawMaterialIds: selectedItem.rawMaterialIds || [],
        } : {
            id: selectedItem.id,
            name: selectedItem.name || '',
            quantity: selectedItem.quantity || 0,
        };

        try {
            const url = activeTab === 'component'
                ? `/api/components/${updatedItem.id}`
                : `/api/RawMaterials/${updatedItem.id}`;

            await axios.put(url, updatedItem, {
                headers: { 'Content-Type': 'application/json' },
            });

            await fetchComponents(); // Обновляем список компонентов
            if (activeTab === 'rawMaterial') await fetchRawMaterials();

            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (error) {
            console.error('Ошибка при редактировании:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            const url = activeTab === 'component'
                ? `/api/components/${selectedItem.id}`
                : `/api/RawMaterials/${selectedItem.id}`;

            await axios.delete(url);

            if (activeTab === 'component') {
                fetchComponents();
            } else {
                fetchRawMaterials();
            }

            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleMultiSelectChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setNewComponent({ ...newComponent, rawMaterialIds: selectedIds });
    };

    const rawMaterialOptions = rawMaterials.map(rawMaterial => ({
        value: rawMaterial.id,
        label: rawMaterial.name,
    }));

    return (
        <div className="settings-components">
            <h2>Компоненты и Сырье</h2>

            <button
                className="add-button"
                onClick={() => {
                    setSelectedItem(null);
                    setIsModalOpen(true);
                }}
            >
                Добавить
            </button>

            <div className="content-components">
                <div className="column">
                    <h3>Компоненты</h3>
                    <ul>
                        {components.map((component) => (
                            <li key={component.id} className="clickable" onClick={() => openEditModal(component, 'component')}>
                                <div>
                                    <strong>{component.name}</strong> - {component.description || 'Нет описания'}
                                </div>
                                {component.rawMaterials?.length > 0 && (
                                    <div className="raw-material-list">
                                        <h4>Сырье:</h4>
                                        <ul>
                                            {component.rawMaterials.map((rawMaterial) => (
                                                <li key={rawMaterial.id}>{rawMaterial.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="column">
                    <h3>Сырье</h3>
                    <ul>
                        {rawMaterials.map((rawMaterial) => (
                            <li
                                key={rawMaterial.id}
                                onClick={() => openEditModal(rawMaterial, 'rawMaterial')}
                                className="clickable"
                            >
                                {rawMaterial.name} - {rawMaterial.quantity} шт.
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close-button"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>

                        {selectedItem ? (
                            <>
                                <h3>{activeTab === 'component' ? 'Редактировать компонент' : 'Редактировать сырье'}</h3>

                                <input
                                    type="text"
                                    value={selectedItem.name}
                                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                                    placeholder={activeTab === 'component' ? 'Название компонента' : 'Название сырья'}
                                />

                                {activeTab === 'component' ? (
                                    <>
                                        <textarea
                                            value={selectedItem.description}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                                            placeholder="Описание компонента"
                                        />
                                        <Select
                                            isMulti
                                            options={rawMaterialOptions}
                                            onChange={(selected) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    rawMaterialIds: selected.map(option => option.value),
                                                })
                                            }
                                            value={rawMaterialOptions.filter(option =>
                                                selectedItem.rawMaterialIds?.includes(option.value)
                                            )}
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="number"
                                        value={selectedItem.quantity}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value, 10) })}
                                        placeholder="Количество"
                                    />
                                )}

                                <div className="modal-actions">
                                    <button onClick={handleEdit}>Сохранить</button>
                                    <button onClick={handleDelete} className="delete-button">Удалить</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="tabs">
                                    <button
                                        className={activeTab === 'component' ? 'active' : ''}
                                        onClick={() => setActiveTab('component')}
                                    >
                                        Компонент
                                    </button>
                                    <button
                                        className={activeTab === 'rawMaterial' ? 'active' : ''}
                                        onClick={() => setActiveTab('rawMaterial')}
                                    >
                                        Сырье
                                    </button>
                                </div>

                                {activeTab === 'component' && (
                                    <div className="form">
                                        <h3>Добавить компонент</h3>
                                        <input
                                            type="text"
                                            value={newComponent.name}
                                            onChange={(e) =>
                                                setNewComponent({ ...newComponent, name: e.target.value })
                                            }
                                            placeholder="Название компонента"
                                        />
                                        <textarea
                                            value={newComponent.description}
                                            onChange={(e) =>
                                                setNewComponent({ ...newComponent, description: e.target.value })
                                            }
                                            placeholder="Описание компонента"
                                        />
                                        <Select
                                            isMulti
                                            options={rawMaterialOptions}
                                            onChange={handleMultiSelectChange}
                                            value={rawMaterialOptions.filter(option =>
                                                newComponent.rawMaterialIds.includes(option.value)
                                            )}
                                        />
                                        <button onClick={handleCreateComponent}>Добавить</button>
                                    </div>
                                )}

                                {activeTab === 'rawMaterial' && (
                                    <div className="form">
                                        <h3>Добавить сырье</h3>
                                        <input
                                            type="text"
                                            value={newRawMaterial.name}
                                            onChange={(e) =>
                                                setNewRawMaterial({ ...newRawMaterial, name: e.target.value })
                                            }
                                            placeholder="Название сырья"
                                        />
                                        <input
                                            type="number"
                                            value={newRawMaterial.quantity}
                                            onChange={(e) =>
                                                setNewRawMaterial({ ...newRawMaterial, quantity: parseInt(e.target.value, 10) })
                                            }
                                            placeholder="Количество"
                                        />
                                        <button onClick={handleCreateRawMaterial}>Добавить</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsComponents;
