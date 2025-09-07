import React, { useState } from 'react';

const Settings = () => {
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--purple-light)' }}>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Settings</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 rounded border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                    <p className="font-semibold mb-2">Notifications</p>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
                        <span>Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3 mt-2">
                        <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} />
                        <span>Push notifications</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
