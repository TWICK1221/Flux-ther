import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from "../api";
import '../assets/styles/NewOrderPage.css'; // Импорт стилей
import { useCurrency } from '../CurrencyContext';
import PhoneInput from '../components/PhoneInput';

function NewOrderPage() {
    useEffect(() => {
        const menuList = document.querySelector('.menu-list-NewOrderPage');
        if (menuList) {
            const handleWheelScroll = (event) => {
                event.preventDefault();
                menuList.scrollLeft += event.deltaY; // Горизонтальная прокрутка категорий
            };
            menuList.addEventListener('wheel', handleWheelScroll);
            return () => menuList.removeEventListener('wheel', handleWheelScroll);
        }
    }, []);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
    const [clientDetails, setClientDetails] = useState({
        Номер: '',
        Имя: '',
        Улица: '',
        Дом: '',
        подъезд: '',
        Этаж: '',
        Кв: '',
        Коментарий: ''
    });
    const [currentTab, setCurrentTab] = useState('order');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { currency } = useCurrency();


    // Загрузка категорий и вариантов оплаты
    useEffect(() => {
        fetchCategories();
        fetchPaymentOptions();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const fetchPaymentOptions = async () => {
        try {
            const response = await axios.get('/api/PaymentOptions');
            setPaymentOptions(response.data || []);
            if (response.data.length > 0) {
                setSelectedPaymentOption(response.data[0].name);
            }
        } catch (error) {
            console.error('Ошибка при загрузке вариантов оплаты:', error);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`/api/products?category=${selectedCategory}`)
                .then(response => {
                    setItems(response.data);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке товаров:', error);
                });
        } else {
            setItems([]);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleAddItemToOrder = (item) => {
        const existingItemIndex = orderItems.findIndex(orderItem => orderItem.name === item.name);

        if (existingItemIndex > -1) {
            const updatedOrderItems = [...orderItems];
            updatedOrderItems[existingItemIndex].quantity += 1;
            setOrderItems(updatedOrderItems);
        } else {
            setOrderItems([...orderItems, { ...item, quantity: 1 }]);
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

    const handleSaveOrder = async () => {
        if (!clientDetails['Имя'] || !clientDetails['Номер'] || !clientDetails['Улица'] || !clientDetails['Дом']) {
            alert('Пожалуйста, заполните обязательные поля клиента.');
            return;
        }


        const orderData = {
            clientName: clientDetails['Имя'],
            clientPhone: clientDetails['Номер'],
            clientStreet: clientDetails['Улица'],
            clientHouse: clientDetails['Дом'],
            clientEntrance: clientDetails['подъезд'] || null,
            clientFloor: clientDetails['Этаж'] || null,
            clientFlat: clientDetails['Кв'] || null,
            paymentOption: selectedPaymentOption,
            items: orderItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };
        // Логирование данных перед отправкой на сервер
        console.log("Отправляем заказ на сервер:", orderData);
        try {
            const response = await api.post('/orders', orderData);
            alert('Заказ успешно сохранен!');
            setOrderItems([]);
            setClientDetails({
                Номер: '',
                Имя: '',
                Улица: '',
                Дом: '',
                подъезд: '',
                Этаж: '',
                Кв: '',
                Коментарий: ''
            });
        } catch (error) {
            console.error('Ошибка при сохранении заказа:', error.response?.data || error.message);
            alert('Не удалось сохранить заказ. Проверьте введенные данные.');
        }
    };
    const [orderDetails, setOrderDetails] = useState({
        clientPhone: '',
        // другие данные заказа
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
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
                                            <td>{item.name}</td>
                                            <td className="quantity-controls-NewOrderPage">
                                                <button onClick={() => handleDecreaseQuantity(index)}>-</button>
                                                <input type="text2" readOnly value={item.quantity} />
                                                <button onClick={() => handleIncreaseQuantity(index)}>+</button>
                                            </td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{formatPrice(item.price * item.quantity)}</td>
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
                                        value={clientDetails['Номер']}
                                        onChange={(e) =>
                                            handleClientDetailsChange({ target: { name: 'Номер', value: e.target.value } })
                                        }
                                        placeholder="+7 (xxx) xxx-xx-xx"
                                    />
                                </div>
                                {Object.keys(clientDetails).map((field) => (
                                    field !== 'Номер' && (
                                        <div className="form-group-NewOrderPage" key={field}>
                                            <label>{field}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={clientDetails[field]}
                                                onChange={handleClientDetailsChange}
                                            />
                                        </div>
                                    )
                                ))}
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
                                    {paymentOptions.map(option => (
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
                            id="create-button"
                            className="create-button-NewOrderPage"
                            onClick={handleSaveOrder}
                        >
                            Создать
                        </button>
                    </div>
                </div>
            </div>

            <div className="center-column-NewOrderPage">
                <ul className="menu-list-NewOrderPage">
                    {categories.map(category => (
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
                        <span>{item.price} {currency}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewOrderPage;
