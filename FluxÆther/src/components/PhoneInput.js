import React from 'react';
import InputMask from 'react-input-mask-next';

const PhoneInput = ({ value, onChange, placeholder }) => {
    return (
        <InputMask
            mask="+7 (999) 999-99-99"
            value={value}
            onChange={onChange}
            placeholder={placeholder || "+7 (___) ___-__-__"}
        >
            <input />
        </InputMask>
    );
};

export default PhoneInput;
