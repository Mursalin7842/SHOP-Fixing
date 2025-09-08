import React from 'react';

const StatCard = ({ icon, title, value, growth, onClick }) => (
  <div onClick={onClick} className={`card elevated-card p-6 rounded-lg flex items-center transition-all transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}>
    <div className="p-3 rounded-lg mr-4 bg-[var(--surface-2)]">{icon}</div>
    <div>
      <p className="text-[var(--muted-text)] text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {growth && <p className={`text-sm font-medium ${growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{growth}</p>}
    </div>
  </div>
);

export default StatCard;
