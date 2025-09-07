import React from 'react';

const Notifications = () => {
    const items = [
        { id: 1, title: 'Payout failures detected', detail: '3 payouts failed. Review in Payments.', time: '2m ago' },
        { id: 2, title: 'User reports spike', detail: 'Spike in user reports (+50%).', time: '1h ago' },
        { id: 3, title: 'Pending seller > 48h', detail: 'New seller application pending more than 48 hours.', time: '3h ago' },
    ];

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--purple-light)' }}>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Notifications</h2>
            </div>
            <ul>
                {items.map(n => (
                    <li key={n.id} className="p-4 border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-sm" style={{ color: 'var(--muted-text)' }}>{n.detail}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-text)' }}>{n.time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
