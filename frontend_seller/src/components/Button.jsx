import React from 'react';

const Button = ({ onClick, children, color = 'gray', className = '', type = 'button', disabled = false, ...props }) => {
  const colorClasses = {
    primary: 'bg-[var(--button-primary)] hover:bg-blue-700 text-[var(--button-primary-text)]',
    green: 'bg-[var(--btn-green)] hover:bg-green-700 text-white',
    yellow: 'bg-[var(--btn-yellow)] hover:bg-yellow-600 text-white',
    red: 'bg-[var(--btn-red)] hover:bg-red-700 text-white',
    gray: 'bg-[var(--btn-gray)] hover:bg-gray-600 text-white',
    purple: 'bg-[#6d28d9] hover:bg-[#4c1d95] text-white',
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
