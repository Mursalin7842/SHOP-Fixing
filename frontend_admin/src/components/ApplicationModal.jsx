import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import MessageSquareIcon from './icons/MessageSquareIcon';
import ActionReasonModal from './ActionReasonModal';

import Button from "./Button";
// This is a comment to explain the purpose of this component.
// The ApplicationModal component is a modal dialog that displays the details of a seller or shop application.
const ApplicationModal = ({ application, onClose, onAction, type = 'seller' }) => {
    const [actionReasonModal, setActionReasonModal] = useState({ isOpen: false, type: '' });
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    if (!application || !application.id) return null;

    const handleActionClick = (actionType) => {
        if (!actionType) return; // safety guard
        setActionReasonModal({ isOpen: true, type: actionType });
    };

    // Map internal UI label 'denied' to backend status 'rejected'
    const handleReasonSubmit = ({ reason, comment }) => {
        const mapped = actionReasonModal.type === 'denied' ? 'rejected' : actionReasonModal.type;
        onAction(application.id, mapped, { reason, comment });
        setActionReasonModal({ isOpen: false, type: '' });
        onClose();
    };


    return (
        <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="rounded-lg shadow-xl w-full max-w-2xl transform transition-all border"
                style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)', borderColor: 'var(--border-color)' }}
                onClick={(e)=>e.stopPropagation()}
            >
                    <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="text-xl font-bold">{type === 'seller' ? 'Seller' : 'Shop'} Application Review</h3>
                        <button onClick={onClose} className="p-1 rounded-full"><CloseIcon /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {type === 'seller' ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p style={{ color: 'var(--muted-text)' }}>Applicant Name</p><p>{application.name}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Email Address</p><p>{application.email}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Shop Name</p><p>{application.shopName}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Date Applied</p><p>{application.dateApplied}</p></div>
                                </div>
                                <div><p style={{ color: 'var(--muted-text)' }}>Business Description</p><p>High-quality, futuristic electronic gadgets and accessories. Focused on cutting-edge technology and design.</p></div>
                                <div><p style={{ color: 'var(--muted-text)' }}>Documents</p><p className="hover:underline cursor-pointer" style={{ color: 'var(--purple-light)' }}>business_license.pdf</p></div>
                            </>
                                                ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p style={{ color: 'var(--muted-text)' }}>Shop Name</p><p>{application.shopName}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Seller</p><p>{application.sellerName}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Category</p><p>{application.category}</p></div>
                                    <div><p style={{ color: 'var(--muted-text)' }}>Date Applied</p><p>{application.dateApplied}</p></div>
                                </div>
                                <div><p style={{ color: 'var(--muted-text)' }}>Shop Description</p><p>{application.description}</p></div>
                                                                {(Array.isArray(application.documents) && application.documents.length > 0) && (
                                                                    <div>
                                                                        <p className="font-semibold mt-3">Documents</p>
                                                                        <ul className="list-disc pl-5 text-sm">
                                                                                                                    {application.documents.map(d => (
                                                                                                                        <li key={d.id}><a href={d.file_url || d.file} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{d.doc_type}{d.number ? ` (#${d.number})` : ''}</a></li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {(Array.isArray(application.attachments) && application.attachments.length > 0) && (
                                                                    <div>
                                                                        <p className="font-semibold mt-3">Attachments</p>
                                                                        <ul className="list-disc pl-5 text-sm">
                                                                                                                    {application.attachments.map(a => (
                                                                                                                        <li key={a.id}><a href={a.file_url || a.file} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{a.name || 'Attachment'}</a></li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                            </>
                        )}
                        <div className="pt-4">
                            <h4 className="font-bold mb-2">Action History</h4>
                            <div className="space-y-3 text-sm border-l-2 pl-4" style={{ borderColor: 'var(--border-color)' }}>
                                {application.history && application.history.map((item, index) => (
                                    <div key={index}>
                                        <p className="font-semibold">{item.action} by {item.admin}</p>
                                        <p style={{ color: 'var(--muted-text)' }}>{item.date}</p>
                                        {item.details && <p className="italic mt-1" style={{ color: 'var(--muted-text)' }}>Note: "{item.details}"</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                        <div className="p-6 flex justify-between items-center border-t" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                        <button className="flex items-center space-x-2 font-bold py-2 px-4 rounded transition duration-300" style={{ backgroundColor: 'var(--btn-gray)', color: '#fff' }} onClick={() => setMessageModalOpen(true)}>
                            <MessageSquareIcon />
                            <span>Message Seller</span>
                        </button>
                        <div className="space-x-3">
                            <Button color="yellow" onClick={() => handleActionClick('modification')}>Request Modification</Button>
                            <Button color="red" onClick={() => handleActionClick('denied')}>Deny</Button>
                            <Button color="green" onClick={() => { onAction(application.id, 'approved'); onClose(); }}>Approve</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ActionReasonModal
                isOpen={actionReasonModal.isOpen}
                onClose={() => setActionReasonModal({ isOpen: false, type: '' })}
                onSubmit={handleReasonSubmit}
                actionType={actionReasonModal.type || 'rejected'}
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

export default ApplicationModal;
