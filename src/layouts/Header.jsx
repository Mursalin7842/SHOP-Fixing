import React from 'react';
import { useAppContext } from '../context/AppContext';
import BellIcon from '../components/icons/BellIcon';
import UserIcon from '../components/icons/UserIcon';
import MenuIcon from '../components/icons/MenuIcon';
import SunIcon from '../components/icons/SunIcon';
import MoonIcon from '../components/icons/MoonIcon';

const Header = ({ title, userInfo }) => {
    const { theme, toggleTheme, toggleSidebar } = useAppContext();

    return (
        <header className="h-20 bg-[var(--component-bg)] flex items-center justify-between px-8 border-b border-[var(--purple-light)]">
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[var(--purple-light)]">
                    <MenuIcon />
                </button>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--purple-light)]">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <button className="p-2 rounded-full hover:bg-[var(--purple-light)]"><BellIcon /></button>
                <div className="flex items-center space-x-2">
                    <UserIcon />
                    <div className="text-right hidden sm:block">
                        <p className="font-semibold text-white">{userInfo.preferred_username || 'Admin'}</p>
                        <p className="text-xs text-[var(--purple-text)]">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;