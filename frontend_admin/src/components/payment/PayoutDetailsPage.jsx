import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

// This is a comment to explain the purpose of this component.
// The PayoutDetailsPage component displays the details of a single payout.
const PayoutDetailsPage = ({ payout, onBack }) => (
    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
        <button onClick={onBack} className="flex items-center space-x-2 mb-6" style={{ color: 'var(--sidebar-link-color)' }}>
            <ArrowLeftIcon />
            <span>Back to Payouts</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold">Payout Details</h3>
                <div><p style={{ color: 'var(--muted-text)' }}>Payout ID</p><p className="font-mono">{payout.id}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Seller</p><p>{payout.seller}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Amount</p><p className="text-2xl font-mono" style={{ color: 'var(--btn-green)' }}>${payout.amount.toFixed(2)}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Requested</p><p>{payout.requestedDate}</p></div>
                <div><p style={{ color: 'var(--muted-text)' }}>Status</p><span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>{payout.status}</span></div>
                <div className="pt-4 flex space-x-2">
                    <button className="w-full text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}>Approve</button>
                    <button className="w-full text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-gray)' }}>Deny</button>
                </div>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Included Transactions ({payout.transactions.length})</h3>
                <div className="p-4 rounded-lg max-h-96 overflow-y-auto" style={{ backgroundColor: 'var(--surface-2)' }}>
                    <table className="w-full text-left">
                        <thead><tr><th className="p-2">Transaction ID</th><th className="p-2">Order ID</th><th className="p-2">Amount</th></tr></thead>
                        <tbody>
                            {payout.transactions.map(t => (
                                <tr key={t.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}><td className="p-2 font-mono">{t.id}</td><td className="p-2 font-mono">{t.orderId}</td><td className="p-2 font-mono">${t.amount.toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default PayoutDetailsPage;
