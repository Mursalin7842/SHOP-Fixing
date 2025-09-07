import React from 'react';

// This is a comment to explain the purpose of this component.
// The StatCard component is used to display a single statistic on the dashboard.
const StatCard = ({ icon, title, value, onClick }) => (
    <div
        onClick={onClick}
        className={`p-6 rounded-lg flex items-start transition-transform transform hover:-translate-y-1 border border-[var(--border-color)] ${onClick ? 'cursor-pointer' : ''}`}
    style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}
    >
        <div className="rounded-lg mr-4 p-3" style={{ backgroundColor: 'var(--chip-bg)' }}>{icon}</div>
        <div>
            <p className="text-sm font-medium" style={{ color: 'var(--muted-text)' }}>{title}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--component-text)' }}>{value}</p>
        </div>
    </div>
);

export default StatCard;
