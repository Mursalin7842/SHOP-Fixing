import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import TransactionDetailsPage from '../components/payment/TransactionDetailsPage';
import PayoutDetailsPage from '../components/payment/PayoutDetailsPage';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

const PaymentManagement = () => {
    const [view, setView] = useState('list');
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState('payouts');
    const [searchTerm, setSearchTerm] = useState("");

    const transactions = [
        { id: 'TRN-001', orderId: 'ORD-101', customer: 'Alice', seller: 'JD Electronics', total: 199.99, date: '2025-09-05', method: 'Stripe', status: 'Completed' },
        { id: 'TRN-002', orderId: 'ORD-102', customer: 'Bob', seller: 'Smith\'s Wares', total: 120.00, date: '2025-09-05', method: 'PayPal', status: 'Completed' },
    ];
    const payouts = [
        { id: 'PAY-001', seller: 'JD Electronics', amount: 1250.75, requestedDate: '2025-09-04', status: 'Pending', transactions: [{ id: 'TRN-001', orderId: 'ORD-101', amount: 159.99 }] },
        { id: 'PAY-002', seller: 'Smith\'s Wares', amount: 875.00, requestedDate: '2025-09-03', status: 'Pending', transactions: [{ id: 'TRN-002', orderId: 'ORD-102', amount: 96.00 }] },
    ];

    if (view === 'transaction_details') {
        return <TransactionDetailsPage transaction={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} />
    }
    if (view === 'payout_details') {
        return <PayoutDetailsPage payout={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} />
    }

    return (
        <div className="bg-[var(--component-bg)] rounded-lg shadow-lg text-white">
            <div className="p-6 border-b border-[var(--purple-light)] flex flex-wrap gap-4 justify-between items-center">
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold">Payment Management</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-[var(--purple-light)]">
                        <button onClick={() => setActiveTab('payouts')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'payouts' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Seller Payouts</button>
                        <button onClick={() => setActiveTab('transactions')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Transaction History</button>
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search..." />
            </div>
            {activeTab === 'payouts' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-700/50"><th className="p-4">Payout ID</th><th className="p-4">Seller</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {payouts.map(payout => (
                                <tr key={payout.id} className="border-b border-[var(--purple-light)] hover:bg-gray-700/50">
                                    <td className="p-4 font-mono">{payout.id}</td><td className="p-4">{payout.seller}</td><td className="p-4 font-mono">${payout.amount.toFixed(2)}</td><td className="p-4">{payout.requestedDate}</td>
                                    <td className="p-4"><StatusBadge status={payout.status} /></td>
                                    <td className="p-4 text-center">
                                        <Button color="purple" onClick={() => { setView('payout_details'); setSelectedItem(payout); }}>View Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'transactions' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-700/50"><th className="p-4">Transaction ID</th><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Date</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className="border-b border-[var(--purple-light)] hover:bg-gray-700/50">
                                    <td className="p-4 font-mono">{t.id}</td><td className="p-4 font-mono">{t.orderId}</td><td className="p-4">{t.customer}</td><td className="p-4 font-mono">${t.total.toFixed(2)}</td><td className="p-4">{t.date}</td>
                                    <td className="p-4 text-center">
                                        <Button color="purple" onClick={() => { setView('transaction_details'); setSelectedItem(t); }}>View Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;