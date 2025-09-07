import React from 'react';

// This is a comment to explain the purpose of this component.
// The StatCard component is used to display a single statistic on the dashboard.
const StatCard = ({ icon, title, value, onClick }) => (
    <div onClick={onClick} className={`bg-gray-800 p-6 rounded-lg flex items-start transition-transform transform hover:-translate-y-1 ${onClick ? 'cursor-pointer hover:bg-gray-700' : ''}`}>
        <div className="bg-gray-700 p-3 rounded-lg mr-4">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default StatCard;
