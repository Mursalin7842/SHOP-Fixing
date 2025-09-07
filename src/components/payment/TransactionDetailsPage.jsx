import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

// This is a comment to explain the purpose of this component.
// The TransactionDetailsPage component displays the details of a single transaction.
const TransactionDetailsPage = ({ transaction, onBack }) => (
    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
        <button onClick={onBack} className="flex items-center space-x-2 mb-6" style={{ color: 'var(--sidebar-link-color)' }}>
            <ArrowLeftIcon />
            <span>Back to Transactions</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <div><p style={{ color: 'var(--muted-text)' }}>Transaction ID</p><p className="font-mono">{transaction.id}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Order ID</p><p className="font-mono">{transaction.orderId}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Customer</p><p>{transaction.customer}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Seller</p><p>{transaction.seller}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Date</p><p>{transaction.date}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Payment Method</p><p>{transaction.method}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Status</p><span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>{transaction.status}</span></div>
            </div>
            <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: 'var(--surface-2)' }}>
                <h3 className="text-xl font-bold">Financials</h3>
                <div className="flex justify-between text-lg"><span style={{ color: 'var(--muted-text)' }}>Total Amount</span> <span className="font-mono">${transaction.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--muted-text)' }}>Platform Fee (20%)</span> <span className="font-mono" style={{ color: 'var(--btn-red)' }}>-${(transaction.total * 0.2).toFixed(2)}</span></div>
                <hr style={{ borderColor: 'var(--border-color)' }} />
                <div className="flex justify-between font-bold text-lg"><span style={{ color: 'var(--component-text)' }}>Net to Seller</span> <span className="font-mono" style={{ color: 'var(--btn-green)' }}>${(transaction.total * 0.8).toFixed(2)}</span></div>
                <div className="pt-4">
                    <button className="w-full text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-red)' }}>Issue Refund</button>
                </div>
            </div>
        </div>
    </div>
);

export default TransactionDetailsPage;
