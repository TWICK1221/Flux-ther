import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { api } from "./api";
import './assets/styles/NewOrderPage.css'; // Импорт стилей
import { useCurrency } from './CurrencyContext';
import PhoneInput from './components/PhoneInput';

function EditOrderPage() {
    const { orderId } = useParams();
    const location = useLocation();
    const { currency } = useCurrency();

    const initialOrderData = location.state?.orderData;

    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState(initialOrderData?.items || []);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState(initialOrderData?.paymentOption || '');
    const [clientDetails, setClientDetails] = useState({
        Номер: initialOrderData?.clientPhone || '',
        Имя: initialOrderData?.clientName || '',
        Улица: initialOrderData?.clientStreet || '',
        Дом: initialOrderData?.clientHouse || '',
        подъезд: initialOrderData?.clientEntrance || '',
        Этаж: initialOrderData?.clientFloor || '',
        Кв: initialOrderData?.clientFlat || '',
        Коментарий: ''
    });
    const [currentTab, setCurrentTab] = useState('order');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Функция для разбора строки адреса в объект
    const parseAddressForEditOrderPage = (address) => {
        if (!address) {
            return {
                Улица: '',
                Дом: '',
                подъезд: '',
                Этаж: '',
                Кв: ''
            };
        }

        const parts = address.split(',').map((part) => part.trim());
        const result = {
            Улица: '',
            Дом: '',
            подъезд: '',
            Этаж: '',
            Кв: ''
        };

        parts.forEach((part) => {
            if (part.startsWith('д.')) {
                result.Дом = part.replace('д.', '').trim();
            } else if (part.startsWith('Подъезд')) {
                result.подъезд = part.replace('Подъезд', '').trim();
            } else if (part.startsWith('этаж')) {
                result.Этаж = part.replace('этаж', '').trim();
            } else if (part.startsWith('кв.')) {
                result.Кв = part.replace('кв.', '').trim();
            } else if (!result.Улица) {
                result.Улица = part;
            }
        });

        return result;
    };

    useEffect(() => {
        if (!initialOrderData) {
            // Загрузка данных с сервера
            api.get(`/orders/${orderId}`)
                .then((response) => {
                    const data = response.data;

                    console.log('Данные заказа:', data);

                    // Форматирование товаров
                    const formattedItems = (data.items || []).map((item) => ({
                        id: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                    }));

                    // Заполняем данные клиента
                    const client = data.client || {};
                    setClientDetails({
                        Номер: client.phone || '',
                        Имя: client.name || '',
                        Улица: client.street || 'Улица не указана',
                        Дом: client.house || 'Не указано',
                        подъезд: client.entrance || '',
                        Этаж: client.floor || '',
                        Кв: client.flat || '',
                        Коментарий: data.clientComment || '',
                    });

                    // Устанавливаем товары заказа
                    setOrderItems(formattedItems);

                    // Устанавливаем способ оплаты
                    setSelectedPaymentOption(data.paymentMethod || '');
                })
                .catch((error) =>
                    console.error('Ошибка при загрузке данных заказа:', error.response?.data || error.message)
                );
        }
    }, [orderId, initialOrderData]);



    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    }, []);

    const fetchPaymentOptions = useCallback(async () => {
        try {
            const response = await axios.get('/api/PaymentOptions');
            setPaymentOptions(response.data || []);
            if (!selectedPaymentOption && response.data.length > 0) {
               
            }
        } catch (error) {
            console.error('Ошибка при загрузке вариантов оплаты:', error);
        }
    }, [selectedPaymentOption]);

    useEffect(() => {
        fetchCategories();
        fetchPaymentOptions();
    }, [fetchCategories, fetchPaymentOptions]);

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`/api/products?category=${selectedCategory}`)
                .then(response => setItems(response.data))
                .catch(error => console.error('Ошибка при загрузке товаров:', error));
        } else {
            setItems([]);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleAddItemToOrder = (item) => {
        const existingItemIndex = orderItems.findIndex(orderItem => orderItem.id === item.id);

        if (existingItemIndex > -1) {
            // Если товар уже есть в заказе, увеличиваем его количество
            const updatedOrderItems = [...orderItems];
            updatedOrderItems[existingItemIndex].quantity += 1;
            updatedOrderItems[existingItemIndex].totalPrice =
                updatedOrderItems[existingItemIndex].quantity * updatedOrderItems[existingItemIndex].price;
            setOrderItems(updatedOrderItems);
        } else {
            // Если товар новый, добавляем его с начальным количеством 1
            const newItem = {
                id: item.id,
                productName: item.name, // Используйте правильное имя поля
                quantity: 1,
                price: item.price,
                totalPrice: item.price,
            };
            setOrderItems([...orderItems, newItem]);
        }
    };

    const handleClientDetailsChange = (e) => {
        const { name, value } = e.target;
        setClientDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleDecreaseQuantity = (index) => {
        const updatedOrderItems = [...orderItems];
        if (updatedOrderItems[index].quantity > 1) {
            updatedOrderItems[index].quantity -= 1;
        } else {
            updatedOrderItems.splice(index, 1);
        }
        setOrderItems(updatedOrderItems);
    };

    const handleIncreaseQuantity = (index) => {
        const updatedOrderItems = [...orderItems];
        updatedOrderItems[index].quantity += 1;
        setOrderItems(updatedOrderItems);
    };

    const handleTabChange = (tabName) => {
        setCurrentTab(tabName);
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handlePaymentOptionChange = (optionName) => {
        setSelectedPaymentOption(optionName);
        setIsDropdownOpen(false);
    };

    const handleUpdateOrder = async () => {
        if (!clientDetails['Имя'] || !clientDetails['Номер'] || !clientDetails['Улица'] || !clientDetails['Дом']) {
            alert('Пожалуйста, заполните обязательные поля клиента.');
            return;
        }

        const updatedOrderData = {
            clientName: clientDetails['Имя'],
            clientPhone: clientDetails['Номер'],
            clientStreet: clientDetails['Улица'],
            clientHouse: clientDetails['Дом'],
            clientEntrance: clientDetails['подъезд'] || null,
            clientFloor: clientDetails['Этаж'] || null,
            clientFlat: clientDetails['Кв'] || null,
            paymentOption: selectedPaymentOption, // Передаем текущий вариант оплаты
            items: orderItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            await api.put(`/orders/${orderId}`, updatedOrderData);
            alert('Изменения успешно сохранены!');
        } catch (error) {
            console.error('Ошибка при обновлении заказа:', error.response?.data || error.message);
            alert('Не удалось сохранить изменения.');
        }
    };

    return (
        <div className="new-order-page-NewOrderPage">
            <div className="left-column-NewOrderPage">
                <div className="left-column-buttons-NewOrderPage">
                    <button
                        onClick={() => handleTabChange('order')}
                        className={currentTab === 'order' ? 'active-tab-NewOrderPage' : ''}
                    >
                        Заказ
                    </button>
                    <button
                        onClick={() => handleTabChange('details')}
                        className={currentTab === 'details' ? 'active-tab-NewOrderPage' : ''}
                    >
                        Детали
                    </button>
                </div>
                <div className="left-column-center-NewOrderPage">
                    {currentTab === 'order' && (
                        <div className="order-content-NewOrderPage">
                            <table className="order-table-NewOrderPage">
                                <thead>
                                    <tr>
                                        <th>Назв.</th>
                                        <th>Кол.</th>
                                        <th>Цена</th>
                                        <th>Стоимость</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.productName || 'Без названия'}</td>
                                            <td className="quantity-controls-NewOrderPage">
                                                <button onClick={() => handleDecreaseQuantity(index)}>-</button>
                                                <input type="text2" readOnly value={item.quantity} />
                                                <button onClick={() => handleIncreaseQuantity(index)}>+</button>
                                            </td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{formatPrice(item.totalPrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                    {currentTab === 'details' && (
                        <div className="details-content-NewOrderPage">
                            <form>
                                <div className="form-group-NewOrderPage">
                                    <label>Номер телефона:</label>
                                    <PhoneInput
                                        value={clientDetails.Номер}
                                        onChange={(e) =>
                                            handleClientDetailsChange({ target: { name: "Номер", value: e.target.value } })
                                        }
                                        placeholder="Введите номер телефона"
                                    />
                                </div>
                                {Object.keys(clientDetails).map((field) =>
                                    field !== 'Номер' ? (
                                        <div className="form-group-NewOrderPage" key={field}>
                                            <label>{field}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={clientDetails[field]}
                                                onChange={handleClientDetailsChange}
                                            />
                                        </div>
                                    ) : null
                                )}
                            </form>
                        </div>
                    )}
                </div>
                <div className="left-column-bottom-NewOrderPage">
                    <div className="total-price-NewOrderPage">
                        <strong>К оплате:</strong> {formatPrice(calculateTotalPrice())}
                    </div>
                    <div className="payment-option-NewOrderPage">
                        <div className="payment-dropdown-NewOrderPage">
                            <button
                                className="dropdown-button-NewOrderPage"
                                onClick={toggleDropdown}
                            >
                                {selectedPaymentOption || 'Выберите способ оплаты'}
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content-NewOrderPage">
                                    {paymentOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            className="dropdown-item-NewOrderPage"
                                            onClick={() => handlePaymentOptionChange(option.name)}
                                        >
                                            {option.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="create-button-NewOrderPage"
                            onClick={handleUpdateOrder}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            </div>
            <div className="center-column-NewOrderPage">
                <ul className="menu-list-NewOrderPage">
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button onClick={() => handleCategoryChange(category.id)}>{category.name}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="product-list-NewOrderPage">
                {items.length === 0 && <p>Выберите категорию для отображения товаров</p>}
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="product-item-NewOrderPage"
                        onClick={() => handleAddItemToOrder(item)}
                    >
                        <span>{item.name}</span>
                        <span>{formatPrice(item.price)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EditOrderPage;
