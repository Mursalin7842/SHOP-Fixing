import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import TransactionDetailsPage from '../components/payment/TransactionDetailsPage';
import PayoutDetailsPage from '../components/payment/PayoutDetailsPage';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { fetchPayments } from '../redux/actions/paymentActions';

const PaymentManagement = () => {
    const [view, setView] = useState('list');
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState('payouts');
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useDispatch();
    const { loading, transactions, payouts, error } = useSelector(state => state.payments);

    useEffect(() => { dispatch(fetchPayments()); }, [dispatch]);

    const filteredTransactions = useMemo(() => (transactions || []).filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase())
    ), [transactions, searchTerm]);

    const filteredPayouts = useMemo(() => (payouts || []).filter(p =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchTerm.toLowerCase())
    ), [payouts, searchTerm]);

    if (view === 'transaction_details') {
        return <TransactionDetailsPage transaction={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} />
    }
    if (view === 'payout_details') {
        return <PayoutDetailsPage payout={selectedItem} onBack={() => { setView('list'); setSelectedItem(null); }} />
    }

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Payment Management</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {['payouts','transactions'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2' : ''}`} style={{ borderColor: activeTab === tab ? 'var(--purple-light)' : 'transparent', color: activeTab === tab ? 'var(--text-color)' : 'var(--muted-text)' }}>{tab === 'payouts' ? 'Seller Payouts' : 'Transaction History'}</button>
                        ))}
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search..." />
            </div>
            {activeTab === 'payouts' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr style={{ backgroundColor: 'var(--table-header-bg)' }}><th className="p-4">Payout ID</th><th className="p-4">Seller</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" className="text-center p-8 text-red-500">{error}</td></tr>
                            ) : filteredPayouts.map(payout => (
                                <tr key={payout.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                    <td className="p-4 font-mono">{payout.id}</td><td className="p-4">{payout.seller}</td><td className="p-4 font-mono">${payout.amount.toFixed(2)}</td><td className="p-4">{payout.requestedDate}</td>
                                    <td className="p-4"><StatusBadge status={payout.status} /></td>
                                    <td className="p-4 text-center">
                                        <Button color="primary" onClick={() => { setView('payout_details'); setSelectedItem(payout); }}>View Details</Button>
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
                        <thead><tr style={{ backgroundColor: 'var(--table-header-bg)' }}><th className="p-4">Transaction ID</th><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Date</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" className="text-center p-8 text-red-500">{error}</td></tr>
                            ) : filteredTransactions.map(t => (
                                <tr key={t.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                    <td className="p-4 font-mono">{t.id}</td><td className="p-4 font-mono">{t.orderId}</td><td className="p-4">{t.customer}</td><td className="p-4 font-mono">${t.total.toFixed(2)}</td><td className="p-4">{t.date}</td>
                                    <td className="p-4 text-center">
                                        <Button color="primary" onClick={() => { setView('transaction_details'); setSelectedItem(t); }}>View Details</Button>
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