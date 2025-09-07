import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContextUtils';
import BellIcon from '../components/icons/BellIcon';
import UserIcon from '../components/icons/UserIcon';
import MenuIcon from '../components/icons/MenuIcon';
import SunIcon from '../components/icons/SunIcon';
import MoonIcon from '../components/icons/MoonIcon';

const Header = ({ title, userInfo, onLogout }) => {
    const { theme, setTheme, toggleSidebar } = useAppContext();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const notifications = [
        { id: 1, text: '3 payouts failed. Review in Payments.', time: '2m ago' },
        { id: 2, text: 'Spike in user reports (+50%).', time: '1h ago' },
        { id: 3, text: 'New seller application pending > 48h.', time: '3h ago' },
    ];

    return (
        <header className="h-20 bg-[var(--component-bg)] text-[var(--component-text)] flex items-center justify-between px-8 border-b relative" style={{ borderColor: 'var(--border-color)' }}>
            {(isNotifOpen || isProfileOpen) && (
                <button
                    aria-label="Close menus"
                    onClick={() => { setIsNotifOpen(false); setIsProfileOpen(false); }}
                    className="fixed inset-0 cursor-default"
                    style={{ backgroundColor: 'var(--overlay-bg)' }}
                />
            )}
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[var(--purple-light)]">
                    <MenuIcon />
                </button>
                <h1 className="text-2xl font-bold text-[var(--component-text)]">{title}</h1>
            </div>
            <div className="flex items-center space-x-4 relative">
                <div className="flex items-center gap-2">
                    <button onClick={() => setTheme('light')} className={`p-2 rounded-full hover:bg-[var(--purple-light)] ${theme === 'light' ? 'ring-2 ring-[var(--purple-light)]' : ''}`} aria-label="Light mode">
                        <SunIcon />
                    </button>
                    <button onClick={() => setTheme('dark')} className={`p-2 rounded-full hover:bg-[var(--purple-light)] ${theme === 'dark' ? 'ring-2 ring-[var(--purple-light)]' : ''}`} aria-label="Dark mode">
                        <MoonIcon />
                    </button>
                </div>
                <div className="relative" ref={notifRef}>
                    <button onClick={(e) => { e.stopPropagation(); setIsNotifOpen(v => !v); }} className="p-2 rounded-full hover:bg-[var(--purple-light)]" aria-haspopup="true" aria-expanded={isNotifOpen} aria-label="Notifications">
                        <BellIcon />
                    </button>
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                                <p className="font-semibold">Notifications</p>
                            </div>
                            <ul className="max-h-72 overflow-auto">
                                {notifications.map(n => (
                                    <li key={n.id} className="px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                                        <p className="text-sm">{n.text}</p>
                                        <p className="text-xs" style={{ color: 'var(--muted-text)' }}>{n.time}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="px-4 py-2 flex items-center justify-between">
                                <a href="#/notifications" className="text-sm font-medium" style={{ color: 'var(--purple-light)' }} onClick={() => setIsNotifOpen(false)}>View all</a>
                                <button className="text-sm font-medium" style={{ color: 'var(--purple-light)' }} onClick={() => setIsNotifOpen(false)}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative" ref={profileRef}>
                    <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(v => !v); }} className="flex items-center space-x-2 p-1 rounded hover:bg-[var(--purple-light)]" aria-haspopup="true" aria-expanded={isProfileOpen}>
                        <UserIcon />
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-[var(--component-text)]">{userInfo.preferred_username || 'Admin'}</p>
                            <p className="text-xs" style={{ color: 'var(--purple-light)' }}>Administrator</p>
                        </div>
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                            <a className="block px-4 py-2 hover:bg-[var(--table-row-hover)]" href="#/profile">Profile</a>
                            <a className="block px-4 py-2 hover:bg-[var(--table-row-hover)]" href="#/settings">Settings</a>
                            <div className="border-t" style={{ borderColor: 'var(--border-color)' }}></div>
                            <button
                                className="w-full text-left px-4 py-2 text-white"
                                style={{ backgroundColor: 'var(--btn-red)' }}
                                onClick={() => { setIsProfileOpen(false); onLogout && onLogout(); }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;