import React from 'react';

const Button = ({ onClick, children, color = 'gray', className = '' }) => {
    const colorClasses = {
        primary: 'bg-[var(--button-primary)] hover:bg-blue-700 text-[var(--button-primary-text)]',
        green: 'bg-[var(--btn-green)] hover:bg-green-700 text-white',
        yellow: 'bg-[var(--btn-yellow)] hover:bg-yellow-600 text-white',
        red: 'bg-[var(--btn-red)] hover:bg-red-700 text-white',
        gray: 'bg-[var(--btn-gray)] hover:bg-gray-600 text-white',
        // Use hardcoded purple for reliability
        purple: 'bg-[#6d28d9] hover:bg-[#4c1d95] text-white',
    };

    return (
        <button
            onClick={onClick}
            className={`font-bold py-2 px-4 rounded transition duration-300 ${colorClasses[color]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;