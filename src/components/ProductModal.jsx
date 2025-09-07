import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import MessageSquareIcon from './icons/MessageSquareIcon';
import ActionReasonModal from './ActionReasonModal';

// This is a comment to explain the purpose of this component.
// The ProductModal component is a modal dialog that displays the details of a product.
const ProductModal = ({ product, onClose, onAction, tab }) => {
    const [actionReasonModal, setActionReasonModal] = useState({ isOpen: false, type: '' });
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    if (!product) return null;

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
                <div className="rounded-lg shadow-xl w-full max-w-3xl transform transition-all" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
                    <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="text-xl font-bold">Product Review: {product.name}</h3>
                        <button onClick={onClose} className="p-1 rounded-full"><CloseIcon /></button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                        <div>
                            <img src={`https://placehold.co/600x400/161b22/FFFFFF?text=${product.name.replace(' ', '+')}`} alt={product.name} className="rounded-lg w-full mb-4" />
                            {tab === 'flagged' && (
                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)' }}>
                                    <h4 className="font-bold">Reason for Flag</h4>
                                    <p style={{ color: 'var(--muted-text)' }}>{product.reason}</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div><p style={{ color: 'var(--muted-text)' }}>Seller</p><p>{product.seller}</p></div>
                            <div><p style={{ color: 'var(--muted-text)' }}>Price</p><p className="font-mono text-lg">${product.price.toFixed(2)}</p></div>
                            <div><p style={{ color: 'var(--muted-text)' }}>Category</p><p>{product.category}</p></div>
                            <div><p style={{ color: 'var(--muted-text)' }}>Stock</p><p>{product.stock} units</p></div>
                            <div><p style={{ color: 'var(--muted-text)' }}>Description</p><p>{product.description}</p></div>
                            <div className="pt-4">
                                <h4 className="font-bold mb-2">Action History</h4>
                                <div className="space-y-3 text-sm border-l-2 pl-4" style={{ borderColor: 'var(--border-color)' }}>
                                    {product.history && product.history.map((item, index) => (
                                        <div key={index}>
                                            <p className="font-semibold">{item.action} by {item.admin}</p>
                                            <p style={{ color: 'var(--muted-text)' }}>{item.date}</p>
                                            {item.details && <p className="italic mt-1" style={{ color: 'var(--muted-text)' }}>Note: "{item.details}"</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex justify-between items-center border-t" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                        <button className="flex items-center space-x-2 font-bold py-2 px-4 rounded transition duration-300" style={{ backgroundColor: 'var(--btn-gray)', color: '#fff' }} onClick={() => setMessageModalOpen(true)}>
                            <MessageSquareIcon />
                            <span>Message Seller</span>
                        </button>
                        <div className="flex justify-end space-x-3">
                            {tab === 'flagged' ? (
                                <>
                                    <button onClick={() => { onAction(product.id, 'approved'); onClose(); }} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-green)' }}>Dismiss Flag</button>
                                    <button onClick={() => handleActionClick('modification')} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-yellow)' }}>Request Modification</button>
                                    <button onClick={() => handleActionClick('rejected')} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-red)' }}>Unlist Product</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleActionClick('modification')} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-yellow)' }}>Request Modification</button>
                                    <button onClick={() => handleActionClick('rejected')} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-red)' }}>Reject</button>
                                    <button onClick={() => { onAction(product.id, 'approved'); onClose(); }} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-green)' }}>Approve</button>
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
            {messageModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="rounded-lg shadow-xl w-full max-w-md p-6" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
                        <h3 className="text-lg font-bold mb-4">Send Message to Seller</h3>
                        <textarea className="w-full h-24 p-2 rounded mb-4" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }} placeholder="Type your message here..."></textarea>
                        <div className="flex justify-end space-x-3">
                            <button className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-gray)' }} onClick={() => setMessageModalOpen(false)}>Cancel</button>
                            <button className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }} onClick={() => setMessageModalOpen(false)}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductModal;
