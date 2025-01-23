// src/pages/CatalogSettings/SettingsProducts.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsProducts.css'; // Подключение стилей

function SettingsProducts() {
    const [products, setProducts] = useState([]); // Список всех товаров
    const [categories, setCategories] = useState([]); // Список категорий
    const [categoryProducts, setCategoryProducts] = useState([]); // Товары текущей категории
    const [selectedCategoryName, setSelectedCategoryName] = useState(''); // Название выбранной категории
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, categoryid: '' }); // Новый товар
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна для добавления товара
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Состояние модального окна для редактирования товара
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // Состояние модального окна для товаров категории
    const [currentProduct, setCurrentProduct] = useState(null); // Текущий редактируемый товар

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data || []);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const handleCategoryClick = (category) => {
        const filteredProducts = products.filter(product => product.categoryName === category.name);
        setCategoryProducts(filteredProducts);
        setSelectedCategoryName(category.name);
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCategoryProducts([]);
    };

    const handleCreateProduct = async () => {
        if (!newProduct.name || !newProduct.description || newProduct.price <= 0 || !newProduct.categoryid) {
            alert('Заполните все поля корректно!');
            return;
        }

        try {
            await axios.post('/api/products', newProduct, {
                headers: { 'Content-Type': 'application/json' },
            });

            fetchProducts();
            setNewProduct({ name: '', description: '', price: 0, categoryid: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
            alert('Не удалось добавить товар. Попробуйте еще раз.');
        }
    };

    const handleEditProduct = async () => {
        console.log('Редактируемый товар:', currentProduct);

        try {
            await axios.put(`/api/products/${currentProduct.id}`, currentProduct, {
                headers: { 'Content-Type': 'application/json' },
            });
            fetchProducts();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Ошибка при редактировании товара:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };

    return (
        <div className="settings-products">
            <h2>Товары</h2>

            <button
                className="add-product-button"
                onClick={() => setIsModalOpen(true)}
            >
                +
            </button>

            <div className="category-list">
                <h3>Категории</h3>
                <ul>
                    {categories.map(category => (
                        <li
                            key={category.id}
                            className="category-item"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="product-list">
                <table>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>Категория</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description || "Нет описания"}</td>
                                <td>{product.price} руб.</td>
                                <td>{product.categoryName}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setCurrentProduct(product);
                                            setIsEditModalOpen(true);
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                        <h3>Добавить товар</h3>
                        <input
                            type="text"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Название товара"
                        />
                        <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Описание товара"
                        />
                        <input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                            placeholder="Цена товара"
                        />
                        <select
                            value={newProduct.categoryid}
                            onChange={(e) => setNewProduct({ ...newProduct, categoryid: e.target.value })}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleCreateProduct}>Добавить товар</button>
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
                        <h3>Редактировать товар</h3>
                        <input
                            type="text"
                            value={currentProduct?.name || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                            placeholder="Название товара"
                        />
                        <textarea
                            value={currentProduct?.description || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                            placeholder="Описание товара"
                        />
                        <input
                            type="number"
                            value={currentProduct?.price || 0}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                            placeholder="Цена товара"
                        />
                        <select
                            value={currentProduct?.categoryid || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, categoryid: e.target.value })}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleEditProduct}>Сохранить</button>
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
                            {categoryProducts.map(product => (
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

export default SettingsProducts;
