import React from 'react';

const Profile = ({ user }) => {
    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--purple-light)' }}>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Profile</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full mb-4" style={{ backgroundColor: 'var(--chip-bg)' }}></div>
                    <p className="font-semibold">{user?.preferred_username || 'Admin'}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Administrator</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="p-4 rounded border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                        <p className="font-semibold mb-2">Account</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><p style={{ color: 'var(--muted-text)' }}>Username</p><p>{user?.preferred_username || 'Admin'}</p></div>
                            <div><p style={{ color: 'var(--muted-text)' }}>Role</p><p>Administrator</p></div>
                        </div>
                    </div>
                    <div className="p-4 rounded border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                        <p className="font-semibold mb-2">Actions</p>
                        <div className="flex gap-3">
                            <button className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}>Edit Profile</button>
                            <button className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--btn-gray)' }}>Change Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
