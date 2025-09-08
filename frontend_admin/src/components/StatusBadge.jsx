import React from 'react';

const StatusBadge = ({ status }) => {
    const statusClasses = {
        pending: 'bg-[var(--badge-yellow-bg)] text-[var(--badge-yellow-text)]',
        approved: 'bg-[var(--badge-green-bg)] text-[var(--badge-green-text)]',
        rejected: 'bg-[var(--badge-red-bg)] text-[var(--badge-red-text)]',
        modification: 'bg-[var(--badge-yellow-bg)] text-[var(--badge-yellow-text)]',
        resubmitted: 'bg-[var(--badge-green-bg)] text-[var(--badge-green-text)]',
        waiting: 'bg-[var(--badge-yellow-bg)] text-[var(--badge-yellow-text)]',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[status.toLowerCase()] || ''}`}>
            {status}
        </span>
    );
};

export default StatusBadge;