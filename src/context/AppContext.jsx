import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const toggleSidebar = () => {
        setSidebarOpen(prevState => !prevState);
    };

    return (
        <AppContext.Provider value={{ theme, toggleTheme, isSidebarOpen, toggleSidebar }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};