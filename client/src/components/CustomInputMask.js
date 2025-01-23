// Путь: src/components/CustomInputMask.js
import React from 'react';
import InputMask from 'react-input-mask-next';

const CustomInputMask = ({ value, onChange, mask, placeholder }) => {
    return (
        <InputMask
            mask={mask}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maskChar="_" // Символ-заполнитель для пустых полей
        >
            {(inputProps) => <input {...inputProps} />}
        </InputMask>
    );
};

export default CustomInputMask;
