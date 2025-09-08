import React, { useState } from 'react';

// This is a comment to explain the purpose of this component.
// The ActionReasonModal component is a modal dialog that allows the admin to provide a reason for an action.
const ActionReasonModal = ({ isOpen, onClose, onSubmit, actionType }) => {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');

    const reasons = {
        denied: ['Violates Policy', 'Incomplete Information', 'Spam/Fraudulent', 'Other'],
        modification: ['Business license is blurry', 'More information needed', 'Low-quality images', 'Other'],
        rejected: ['Violates Policy', 'Counterfeit Item', 'Prohibited Item', 'Other'],
    };

    const handleSubmit = () => {
        if (!reason) {
            // In a real app, show a user-friendly error message
            console.error("Please select a reason.");
            return;
        }
        onSubmit({ reason, comment });
    };

    if (!isOpen) return null;

    const titleText = {
        denied: 'Denial',
        modification: 'Modification Request',
        rejected: 'Rejection'
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)' }}>
                <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-xl font-bold">Reason for {titleText[actionType]}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block mb-2" style={{ color: 'var(--muted-text)' }}>Reason (Required)</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full rounded-lg px-3 py-2"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)', borderColor: 'var(--border-color)', borderWidth: 1 }}
                        >
                            <option value="">-- Select a reason --</option>
                            {(reasons[actionType] || []).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2" style={{ color: 'var(--muted-text)' }}>Additional Comments (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Provide specific details for the seller..."
                            className="w-full rounded-lg px-3 py-2"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)', borderColor: 'var(--border-color)', borderWidth: 1 }}
                        ></textarea>
                    </div>
                </div>
                <div className="p-4 flex justify-end space-x-3 border-t" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                    <button onClick={onClose} className="font-bold py-2 px-4 rounded text-white" style={{ backgroundColor: 'var(--btn-gray)' }}>Cancel</button>
                    <button onClick={handleSubmit} className="font-bold py-2 px-4 rounded text-white" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ActionReasonModal;
