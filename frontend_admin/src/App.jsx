import React, { useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

function App() {
    // Do not auto-restore prior session; always force explicit login
    const [user, setUser] = useState(null);

    const handleLogin = (username) => {
        const nextUser = { preferred_username: username || 'Admin' };
        setUser(nextUser);
        if (typeof window !== 'undefined') {
            window.location.hash = '/dashboard';
        }
    };

    const handleLogout = () => {
        setUser(null);
    if (typeof window !== 'undefined') window.location.hash = '/login';
    };

    // If not logged in, show the login page
    if (!user) return <LoginPage onLogin={handleLogin} />;

    // Logged in -> render admin
    return <AdminLayout userInfo={user} onLogout={handleLogout} />;
}

export default App;