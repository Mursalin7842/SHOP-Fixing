import React from 'react';

const Button = ({ onClick, children, color = 'gray', className = '' }) => {
    const colorClasses = {
        green: 'bg-[var(--btn-green)] hover:bg-green-700',
        yellow: 'bg-[var(--btn-yellow)] hover:bg-yellow-600',
        red: 'bg-[var(--btn-red)] hover:bg-red-700',
        gray: 'bg-[var(--btn-gray)] hover:bg-gray-600',
        purple: 'bg-[var(--purple-light)] hover:bg-[var(--purple-dark)]',
    };

    return (
        <button
            onClick={onClick}
            className={`text-white font-bold py-2 px-4 rounded transition duration-300 ${colorClasses[color]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;