import React, { useEffect, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

const STORAGE_KEY = 'admin_user';

function App() {
    const getInitialUser = () => {
        try {
            if (typeof window === 'undefined') return null;
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const [user, setUser] = useState(getInitialUser);

    useEffect(() => {
        // Persist simple login state (optional)
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const handleLogin = (username) => {
        const nextUser = { preferred_username: username || 'Admin' };
        setUser(nextUser);
        // Default to dashboard after login
        if (typeof window !== 'undefined') {
            if (!window.location.hash || window.location.hash === '#/login') {
                window.location.hash = '/dashboard';
            }
        }
    };

    const handleLogout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            // Clear any in-app routing hash so we land on login cleanly
            window.location.hash = '/login';
        }
    };

    // If not logged in, show the login page
    if (!user) return <LoginPage onLogin={handleLogin} />;

    // Logged in -> render admin
    return <AdminLayout userInfo={user} onLogout={handleLogout} />;
}

export default App;