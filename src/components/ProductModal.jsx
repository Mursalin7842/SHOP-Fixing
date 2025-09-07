import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import MessageSquareIcon from './icons/MessageSquareIcon';
import ActionReasonModal from './ActionReasonModal';

// This is a comment to explain the purpose of this component.
// The ProductModal component is a modal dialog that displays the details of a product.
const ProductModal = ({ product, onClose, onAction, tab }) => {
    if (!product) return null;
    const [actionReasonModal, setActionReasonModal] = useState({ isOpen: false, type: '' });

    const handleActionClick = (actionType) => {
        setActionReasonModal({ isOpen: true, type: actionType });
    };

    const handleReasonSubmit = ({ reason, comment }) => {
        onAction(product.id, actionReasonModal.type, { reason, comment });
        setActionReasonModal({ isOpen: false, type: '' });
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl transform transition-all">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold">Product Review: {product.name}</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><CloseIcon /></button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                        <div>
                            <img src={`https://placehold.co/600x400/161b22/FFFFFF?text=${product.name.replace(' ', '+')}`} alt={product.name} className="rounded-lg w-full mb-4" />
                            {tab === 'flagged' && (
                                <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-lg">
                                    <h4 className="font-bold text-yellow-300">Reason for Flag</h4>
                                    <p className="text-yellow-200">{product.reason}</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div><p className="text-gray-400">Seller</p><p>{product.seller}</p></div>
                            <div><p className="text-gray-400">Price</p><p className="font-mono text-lg">${product.price.toFixed(2)}</p></div>
                            <div><p className="text-gray-400">Category</p><p>{product.category}</p></div>
                            <div><p className="text-gray-400">Stock</p><p>{product.stock} units</p></div>
                            <div><p className="text-gray-400">Description</p><p>{product.description}</p></div>
                            <div className="pt-4">
                                <h4 className="font-bold text-gray-300 mb-2">Action History</h4>
                                <div className="space-y-3 text-sm border-l-2 border-gray-700 pl-4">
                                    {product.history && product.history.map((item, index) => (
                                        <div key={index}>
                                            <p className="font-semibold">{item.action} by {item.admin}</p>
                                            <p className="text-gray-400">{item.date}</p>
                                            {item.details && <p className="text-gray-400 italic mt-1">Note: "{item.details}"</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-between items-center">
                        <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 font-bold py-2 px-4 rounded transition duration-300">
                            <MessageSquareIcon />
                            <span>Message Seller</span>
                        </button>
                        <div className="flex justify-end space-x-3">
                            {tab === 'flagged' ? (
                                <>
                                    <button onClick={() => { onAction(product.id, 'approved'); onClose(); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Dismiss Flag</button>
                                    <button onClick={() => handleActionClick('modification')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Request Modification</button>
                                    <button onClick={() => handleActionClick('rejected')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Unlist Product</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleActionClick('modification')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Request Modification</button>
                                    <button onClick={() => handleActionClick('rejected')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Reject</button>
                                    <button onClick={() => { onAction(product.id, 'approved'); onClose(); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Approve</button>
                                </>
                            )}
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

export default ProductModal;
