import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContextUtils';

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const toggleSidebar = () => {
        setSidebarOpen(prevState => !prevState);
    };

    return (
        <AppContext.Provider value={{ theme, setTheme, toggleTheme, isSidebarOpen, toggleSidebar }}>
            {children}
        </AppContext.Provider>
    );
};