// src/pages/CatalogSettings/SettingsCategories.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsCategories.css'; // Подключение стилей

function SettingsCategories() {
    const [categories, setCategories] = useState([]); // Список категорий
    const [categoryProducts, setCategoryProducts] = useState([]); // Товары текущей категории
    const [selectedCategoryName, setSelectedCategoryName] = useState(''); // Название выбранной категории
    const [newCategoryName, setNewCategoryName] = useState(''); // Название новой категории
    const [newCategoryColor, setNewCategoryColor] = useState('#000000'); // Цвет новой категории
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна для добавления категории
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // Состояние модального окна для товаров категории
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Состояние модального окна для редактирования категории
    const [currentCategory, setCurrentCategory] = useState(null); // Текущая редактируемая категория

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories'); // Запрос всех категорий
            setCategories(response.data); // Устанавливаем список категорий
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const fetchCategoryProducts = async (categoryId) => {
        try {
            const response = await axios.get(`/api/categories/${categoryId}/products`); // Запрос товаров категории
            setCategoryProducts(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке товаров категории:', error);
        }
    };

    const handleCategoryClick = (category) => {
        fetchCategoryProducts(category.id);
        setSelectedCategoryName(category.name);
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCategoryProducts([]);
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName) {
            alert('Введите название категории!');
            return;
        }

        try {
            const response = await axios.post(
                '/api/categories',
                {
                    name: newCategoryName,
                    color: newCategoryColor, // Передаём цвет
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setCategories([...categories, response.data]); // Обновляем список категорий
            setNewCategoryName(''); // Сбрасываем название
            setNewCategoryColor('#000000'); // Сбрасываем цвет
            setIsModalOpen(false); // Закрываем модальное окно
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
            alert('Не удалось добавить категорию. Попробуйте еще раз.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`/api/categories/${categoryId}`);
            setCategories(categories.filter(category => category.id !== categoryId));
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            alert('Не удалось удалить категорию. Попробуйте еще раз.');
        }
    };

    const handleEditCategory = async () => {
        if (!currentCategory.name) {
            alert('Введите название категории!');
            return;
        }

        try {
            await axios.put(`/api/categories/${currentCategory.id}`, {
                name: currentCategory.name,
                color: currentCategory.color || '#000000', // Передаём цвет по умолчанию, если не изменён
            });
            fetchCategories();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Ошибка при редактировании категории:', error);
            alert('Не удалось редактировать категорию. Попробуйте еще раз.');
        }
    };

    return (
        <div className="settings-categories">
            <h2>Категории</h2>

            <button
                className="add-category-button"
                onClick={() => setIsModalOpen(true)} // Открыть модальное окно
            >
                +
            </button>

            <div className="category-list">
                <ul>
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            style={{ color: category.color }}
                            className="category-item"
                        >
                            <span onClick={() => handleCategoryClick(category)}>{category.name}</span>
                            <button
                                onClick={() => {
                                    setCurrentCategory(category);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close-button"
                            onClick={() => setIsModalOpen(false)} // Закрыть модальное окно
                        >
                            &times;
                        </span>
                        <h3>Добавить категорию</h3>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Название категории"
                        />
                        <div className="color-picker">
                            <label htmlFor="category-color-input">Выберите цвет:</label>
                            <input
                                id="category-color-input"
                                type="color"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                            />
                        </div>
                        <button onClick={handleCreateCategory}>Добавить категорию</button>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close-button"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            &times;
                        </span>
                        <h3>Редактировать категорию</h3>
                        <input
                            type="text"
                            value={currentCategory?.name || ''}
                            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                            placeholder="Название категории"
                        />
                        <div className="color-picker">
                            <label htmlFor="edit-category-color-input">Выберите цвет:</label>
                            <input
                                id="edit-category-color-input"
                                type="color"
                                value={currentCategory?.color || '#000000'}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, color: e.target.value })}
                            />
                        </div>
                        <button onClick={handleEditCategory}>Сохранить изменения</button>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close-button"
                            onClick={closeCategoryModal}
                        >
                            &times;
                        </span>
                        <h3>Товары категории: {selectedCategoryName}</h3>
                        <ul>
                            {categoryProducts.map((product) => (
                                <li key={product.id}>
                                    {product.name} - {product.price} руб.
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsCategories;
