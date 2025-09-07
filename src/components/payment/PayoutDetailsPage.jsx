import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

// This is a comment to explain the purpose of this component.
// The PayoutDetailsPage component displays the details of a single payout.
const PayoutDetailsPage = ({ payout, onBack }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeftIcon />
            <span>Back to Payouts</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold">Payout Details</h3>
                <div><p className="text-gray-400">Payout ID</p><p className="font-mono">{payout.id}</p></div>
                <div><p className="text-gray-400">Seller</p><p>{payout.seller}</p></div>
                <div><p className="text-gray-400">Amount</p><p className="text-2xl font-mono text-green-400">${payout.amount.toFixed(2)}</p></div>
                <div><p className="text-gray-400">Requested</p><p>{payout.requestedDate}</p></div>
                <div><p className="text-gray-400">Status</p><span className="bg-yellow-600/50 text-yellow-300 px-3 py-1 rounded-full text-sm">{payout.status}</span></div>
                <div className="pt-4 flex space-x-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded">Approve</button>
                    <button className="w-full bg-gray-600 hover:bg-gray-500 font-bold py-2 px-4 rounded">Deny</button>
                </div>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Included Transactions ({payout.transactions.length})</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead><tr><th className="p-2">Transaction ID</th><th className="p-2">Order ID</th><th className="p-2">Amount</th></tr></thead>
                        <tbody>
                            {payout.transactions.map(t => (
                                <tr key={t.id} className="border-b border-gray-600"><td className="p-2 font-mono">{t.id}</td><td className="p-2 font-mono">{t.orderId}</td><td className="p-2 font-mono">${t.amount.toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default PayoutDetailsPage;
