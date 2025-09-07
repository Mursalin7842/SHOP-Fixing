import React, { useState } from 'react';
import Button from '../components/Button';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        } else {
            console.error('Please enter a username.');
        }
    };

    return (
        <div className="bg-[var(--deep-violet)] text-white min-h-screen flex items-center justify-center">
            <div className="bg-white/90 text-black p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (any will work)" className="w-full bg-gray-200 border-gray-300 text-black rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--purple-light)]" />
                    <input type="password" placeholder="Password" className="w-full bg-gray-200 border-gray-300 text-black rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--purple-light)]" />
                    <Button type="submit" color="purple" className="w-full">Login</Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;