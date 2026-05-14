import React from 'react';
import '@styles/Input.css'; // Crea este archivo CSS

const Input = ({ label, type = 'text', name, value, onChange, required, className = '' }) => {
    return (
        <div className={`input-group ${className}`}>
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default Input;