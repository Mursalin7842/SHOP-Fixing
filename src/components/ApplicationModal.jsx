import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import MessageSquareIcon from './icons/MessageSquareIcon';
import ActionReasonModal from './ActionReasonModal';

// This is a comment to explain the purpose of this component.
// The ApplicationModal component is a modal dialog that displays the details of a seller or shop application.
const ApplicationModal = ({ application, onClose, onAction, type = 'seller' }) => {
    if (!application) return null;
    const [actionReasonModal, setActionReasonModal] = useState({ isOpen: false, type: '' });

    const handleActionClick = (actionType) => {
        setActionReasonModal({ isOpen: true, type: actionType });
    };

    const handleReasonSubmit = ({ reason, comment }) => {
        onAction(application.id, actionReasonModal.type, { reason, comment });
        setActionReasonModal({ isOpen: false, type: '' });
        onClose();
    };


    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold">{type === 'seller' ? 'Seller' : 'Shop'} Application Review</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><CloseIcon /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {type === 'seller' ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-gray-400">Applicant Name</p><p>{application.name}</p></div>
                                    <div><p className="text-gray-400">Email Address</p><p>{application.email}</p></div>
                                    <div><p className="text-gray-400">Shop Name</p><p>{application.shopName}</p></div>
                                    <div><p className="text-gray-400">Date Applied</p><p>{application.dateApplied}</p></div>
                                </div>
                                <div><p className="text-gray-400">Business Description</p><p>High-quality, futuristic electronic gadgets and accessories. Focused on cutting-edge technology and design.</p></div>
                                <div><p className="text-gray-400">Documents</p><p className="text-blue-400 hover:underline cursor-pointer">business_license.pdf</p></div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-gray-400">Shop Name</p><p>{application.shopName}</p></div>
                                    <div><p className="text-gray-400">Seller</p><p>{application.sellerName}</p></div>
                                    <div><p className="text-gray-400">Category</p><p>{application.category}</p></div>
                                    <div><p className="text-gray-400">Date Applied</p><p>{application.dateApplied}</p></div>
                                </div>
                                <div><p className="text-gray-400">Shop Description</p><p>{application.description}</p></div>
                            </>
                        )}
                        <div className="pt-4">
                            <h4 className="font-bold text-gray-300 mb-2">Action History</h4>
                            <div className="space-y-3 text-sm border-l-2 border-gray-700 pl-4">
                                {application.history && application.history.map((item, index) => (
                                    <div key={index}>
                                        <p className="font-semibold">{item.action} by {item.admin}</p>
                                        <p className="text-gray-400">{item.date}</p>
                                        {item.details && <p className="text-gray-400 italic mt-1">Note: "{item.details}"</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-between items-center">
                        <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 font-bold py-2 px-4 rounded transition duration-300">
                            <MessageSquareIcon />
                            <span>Message Seller</span>
                        </button>
                        <div className="space-x-3">
                            <button onClick={() => handleActionClick('modification')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300">Request Modification</button>
                            <button onClick={() => handleActionClick('denied')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">Deny</button>
                            <button onClick={() => { onAction(application.id, 'approved'); onClose(); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
            <ActionReasonModal
                isOpen={actionReasonModal.isOpen}
                onClose={() => setActionReasonModal({ isOpen: false, type: '' })}
                onSubmit={handleReasonSubmit}
                actionType={actionReasonModal.type}
            />
        </>
    );
};

export default ApplicationModal;
