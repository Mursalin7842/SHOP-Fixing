import React, { useState } from 'react';

// This is a comment to explain the purpose of this component.
// The ActionReasonModal component is a modal dialog that allows the admin to provide a reason for an action.
const ActionReasonModal = ({ isOpen, onClose, onSubmit, actionType }) => {
    if (!isOpen) return null;

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

    const titleText = {
        denied: 'Denial',
        modification: 'Modification Request',
        rejected: 'Rejection'
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold">Reason for {titleText[actionType]}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Reason (Required)</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2"
                        >
                            <option value="">-- Select a reason --</option>
                            {(reasons[actionType] || []).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Additional Comments (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Provide specific details for the seller..."
                            className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2"
                        ></textarea>
                    </div>
                </div>
                <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 font-bold py-2 px-4 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ActionReasonModal;
