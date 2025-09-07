import React from 'react';
import CloseIcon from './icons/CloseIcon';

// This is a comment to explain the purpose of this component.
// The ReportDetailsModal component is a modal dialog that displays the details of a user report.
const ReportDetailsModal = ({ report, onClose }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Report Details: #{report.id}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><CloseIcon /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-gray-400">User ID</p><p className="font-mono">{report.userId}</p></div>
                        <div><p className="text-gray-400">Date</p><p>{report.date}</p></div>
                        <div><p className="text-gray-400">Report Type</p><p>{report.type}</p></div>
                        <div><p className="text-gray-400">Status</p><p>{report.status}</p></div>
                    </div>
                    {report.sellerId && <div><p className="text-gray-400">Associated Seller ID</p><p className="font-mono">{report.sellerId}</p></div>}
                    {report.shopId && <div><p className="text-gray-400">Associated Shop ID</p><p className="font-mono">{report.shopId}</p></div>}
                    {report.productId && <div><p className="text-gray-400">Associated Product ID</p><p className="font-mono">{report.productId}</p></div>}
                    <div><p className="text-gray-400">Subject</p><p className="font-semibold">{report.subject}</p></div>
                    <div><p className="text-gray-400">Description</p><p>{report.description}</p></div>
                </div>
                <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Close</button>
                    <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Mark as Resolved</button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailsModal;
