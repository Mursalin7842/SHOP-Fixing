import React from 'react';

const NotificationItem = ({ icon, text, details, time, onClick }) => {
  const interactive = typeof onClick === 'function';
  return (
    <div
      className={`flex items-start p-4 bg-[var(--surface-2)] rounded-lg mb-4 ${interactive ? 'cursor-pointer hover:bg-[var(--surface-3)] focus:outline-none focus:ring-2 focus:ring-[var(--purple-light)]' : ''}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="mr-4 text-blue-400">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold">{text}</p>
        {details && <p className="text-sm text-[var(--muted-text)] mt-1">{details}</p>}
        <p className="text-xs text-[var(--muted-text)] mt-1">{time}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
