import React from 'react';
import CloseIcon from './icons/CloseIcon';

// This is a comment to explain the purpose of this component.
// The ReportDetailsModal component is a modal dialog that displays the details of a user report.
const ReportDetailsModal = ({ report, onClose }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-xl w-full max-w-3xl" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
                <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-xl font-bold">Report Details: #{report.id}</h3>
                    <button onClick={onClose} className="p-1 rounded-full"><CloseIcon /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div><p style={{ color: 'var(--muted-text)' }}>User ID</p><p className="font-mono">{report.userId}</p></div>
                        <div><p style={{ color: 'var(--muted-text)' }}>Date</p><p>{report.date}</p></div>
                        <div><p style={{ color: 'var(--muted-text)' }}>Report Type</p><p>{report.type}</p></div>
                        <div><p style={{ color: 'var(--muted-text)' }}>Status</p><p>{report.status}</p></div>
                    </div>
                    {report.sellerId && <div><p style={{ color: 'var(--muted-text)' }}>Associated Seller ID</p><p className="font-mono">{report.sellerId}</p></div>}
                    {report.shopId && <div><p style={{ color: 'var(--muted-text)' }}>Associated Shop ID</p><p className="font-mono">{report.shopId}</p></div>}
                    {report.productId && <div><p style={{ color: 'var(--muted-text)' }}>Associated Product ID</p><p className="font-mono">{report.productId}</p></div>}
                    <div><p style={{ color: 'var(--muted-text)' }}>Subject</p><p className="font-semibold">{report.subject}</p></div>
                    <div><p style={{ color: 'var(--muted-text)' }}>Description</p><p>{report.description}</p></div>
                </div>
                <div className="p-6 flex justify-end space-x-3 border-t" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                    <button onClick={onClose} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-gray)' }}>Close</button>
                    <button onClick={onClose} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}>Mark as Resolved</button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailsModal;
