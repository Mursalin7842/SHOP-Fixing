import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

// This is a comment to explain the purpose of this component.
// The TransactionDetailsPage component displays the details of a single transaction.
const TransactionDetailsPage = ({ transaction, onBack }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeftIcon />
            <span>Back to Transactions</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <div><p className="text-gray-400">Transaction ID</p><p className="font-mono">{transaction.id}</p></div>
                <div><p className="text-gray-400">Order ID</p><p className="font-mono">{transaction.orderId}</p></div>
                <div><p className="text-gray-400">Customer</p><p>{transaction.customer}</p></div>
                <div><p className="text-gray-400">Seller</p><p>{transaction.seller}</p></div>
                <div><p className="text-gray-400">Date</p><p>{transaction.date}</p></div>
                <div><p className="text-gray-400">Payment Method</p><p>{transaction.method}</p></div>
                <div><p className="text-gray-400">Status</p><span className="bg-green-600/50 text-green-300 px-3 py-1 rounded-full text-sm">{transaction.status}</span></div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                <h3 className="text-xl font-bold">Financials</h3>
                <div className="flex justify-between text-lg"><span className="text-gray-400">Total Amount</span> <span className="font-mono">${transaction.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Platform Fee (20%)</span> <span className="font-mono text-red-400">-${(transaction.total * 0.2).toFixed(2)}</span></div>
                <hr className="border-gray-600" />
                <div className="flex justify-between font-bold text-lg"><span className="text-gray-300">Net to Seller</span> <span className="font-mono text-green-400">${(transaction.total * 0.8).toFixed(2)}</span></div>
                <div className="pt-4">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Issue Refund</button>
                </div>
            </div>
        </div>
    </div>
);

export default TransactionDetailsPage;
