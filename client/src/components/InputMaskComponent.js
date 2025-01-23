// Путь: src/components/InputMaskComponent.js
import React, { useRef } from 'react';

const PhoneInput = ({ value, onChange }) => {
    const inputRef = useRef();

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder="+7 (999) 999-99-99"
        />
    );
};

export default PhoneInput;
