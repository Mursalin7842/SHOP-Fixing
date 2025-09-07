import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContextUtils';

// Import your page components
import Dashboard from '../pages/Dashboard';
import SellerApproval from '../pages/SellerApproval';
import ShopApproval from '../pages/ShopApproval';
import ProductApproval from '../pages/ProductApproval';
import AnalyticsAndReporting from '../pages/AnalyticsAndReporting';
import PaymentManagement from '../pages/PaymentManagement';
import SellerManagement from '../pages/SellerManagement';
import UserReports from '../pages/UserReports';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Header from './Header';
import Sidebar from './Sidebar';

const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'seller-approval', label: 'Seller Approval' },
    { id: 'shop-approval', label: 'Shop Approval' },
    { id: 'product-approval', label: 'Product Approval' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'payment-management', label: 'Payments' },
    { id: 'seller-management', label: 'Seller Management' },
    { id: 'user-reports', label: 'User Reports' },
];

const pageComponents = {
    'dashboard': Dashboard,
    'seller-approval': SellerApproval,
    'shop-approval': ShopApproval,
    'product-approval': ProductApproval,
    'analytics': AnalyticsAndReporting,
    'payment-management': PaymentManagement,
    'seller-management': SellerManagement,
    'user-reports': UserReports,
    'notifications': Notifications,
    'profile': (props) => <Profile {...props} user={props.userInfo} />, // pass userInfo down
    'settings': Settings,
};

const AdminLayout = ({ userInfo, onLogout }) => {
    const getPageFromHash = () => {
        if (typeof window === 'undefined') return 'dashboard';
        const h = window.location.hash.replace(/^#\/?/, '');
        return pageComponents[h] ? h : 'dashboard';
    };
    const [activePage, setActivePage] = useState(getPageFromHash);
    const { isSidebarOpen } = useAppContext();

    // Keep active page in sync with URL hash so header links like #/profile work
    useEffect(() => {
        const onHash = () => setActivePage(getPageFromHash());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // If hash points to login while authenticated, redirect to dashboard
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const h = window.location.hash.replace(/^#\/?/, '') || '';
            if (h === 'login') {
                window.location.hash = '/dashboard';
            }
        }
    }, []);

    const pageTitleMap = useMemo(() => ({
        ...Object.fromEntries(navItems.map(i => [i.id, i.label])),
        notifications: 'Notifications',
        profile: 'Profile',
        settings: 'Settings',
    }), []);

    // Scroll to section logic for Dashboard
    const scrollToSection = (sectionId) => {
        setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100); // Wait for render
    };

    const navigateTo = (pageId) => {
        if (pageId === 'logout') {
            onLogout && onLogout();
        } else if (activePage === 'dashboard' && [
            'approval-queues', 'critical-alerts', 'stat-cards'
        ].includes(pageId)) {
            scrollToSection(pageId);
        } else {
            // push into hash for consistency with header links
            if (typeof window !== 'undefined') {
                window.location.hash = `/${pageId}`;
            } else {
                setActivePage(pageId);
            }
        }
    };

    const ActivePageComponent = pageComponents[activePage] || Dashboard;

    return (
        <div className="flex flex-col h-screen bg-[var(--background-color)] text-[var(--text-color)]">
            <Header
                title={pageTitleMap[activePage] || 'Dashboard'}
                userInfo={userInfo || {}}
                onLogout={onLogout}
            />
            <div className="flex flex-1 min-h-0">
                {isSidebarOpen && <Sidebar navigateTo={navigateTo} activePage={activePage} />}
                <main className="flex-1 overflow-auto p-6 bg-[var(--surface-2)] text-[var(--text-color)]">
                    <ActivePageComponent navigateTo={navigateTo} userInfo={userInfo} />
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;