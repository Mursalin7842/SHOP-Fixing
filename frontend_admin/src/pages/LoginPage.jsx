
import React, { useState } from 'react';
import EyeIcon from '../components/icons/EyeIcon';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        } else {
            console.error('Please enter a username.');
        }
    };

    return (
    <div className="min-h-screen w-screen flex items-center justify-center" style={{ backgroundColor: '#e0f2fe', color: '#111827' }}>
            <div className="p-8 rounded-lg shadow-lg w-full max-w-sm border" style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#94a3b8' }}>
                <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#cbd5e1' }}></div>
                </div>
                <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (any will work)" className="w-full rounded-lg px-3 py-2 mb-4 focus:outline-none" style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#94a3b8', borderWidth: 1 }} />
                    <div className="relative mb-6">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-lg px-3 py-2 focus:outline-none"
                            style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#94a3b8', borderWidth: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                            style={{ color: 'var(--purple-light)', border: 'none', outline: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
                            tabIndex={-1}
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white font-bold py-2 px-4 rounded transition duration-300"
                        style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;