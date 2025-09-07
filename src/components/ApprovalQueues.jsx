import React from 'react';

// This is a comment to explain the purpose of this component.
// The ApprovalQueues component displays the number of pending approvals for sellers, shops, and products.
const ApprovalQueues = ({ navigateTo }) => (
    <div className="p-6 rounded-lg h-full card" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
        <h3 className="text-lg font-bold mb-4">Approval Queues</h3>
        <ul className="space-y-4">
            <li onClick={() => navigateTo('seller-approval', { initialTab: 'pending' })} className="flex justify-between items-center p-3 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--surface-2)' }}>
                <span>Pending Seller Applications</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>2</span>
            </li>
            <li onClick={() => navigateTo('shop-approval', { initialTab: 'pending' })} className="flex justify-between items-center p-3 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--surface-2)' }}>
                <span>Pending Shop Applications</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>2</span>
            </li>
            <li onClick={() => navigateTo('product-approval', { initialTab: 'pending' })} className="flex justify-between items-center p-3 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--surface-2)' }}>
                <span>Pending Products</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>2</span>
            </li>
            <li onClick={() => navigateTo('product-approval', { initialTab: 'flagged' })} className="flex justify-between items-center p-3 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--surface-2)' }}>
                <span>Flagged Products for Review</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>1</span>
            </li>
        </ul>
    </div>
);

export default ApprovalQueues;
