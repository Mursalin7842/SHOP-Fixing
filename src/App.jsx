import React, { useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const handleLogin = (username) => {
        setUserInfo({ preferred_username: username });
        setAuthenticated(true);
    };

    const handleLogout = () => {
        setUserInfo(null);
        setAuthenticated(false);
    };

    return authenticated ? <AdminLayout userInfo={userInfo} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />;
}

export default App;