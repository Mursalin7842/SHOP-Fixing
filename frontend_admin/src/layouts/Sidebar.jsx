import React, { useState } from 'react';
import { useAppContext } from '../context/AppContextUtils';
import DashboardIcon from '../components/icons/DashboardIcon';
import SellerApprovalIcon from '../components/icons/SellerApprovalIcon';
import ShopApprovalIcon from '../components/icons/ShopApprovalIcon';
import ProductApprovalIcon from '../components/icons/ProductApprovalIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import PaymentManagementIcon from '../components/icons/PaymentManagementIcon';
import SellerManagementIcon from '../components/icons/SellerManagementIcon';
import UserReportsIcon from '../components/icons/UserReportsIcon';
import MessageSquareIcon from '../components/icons/MessageSquareIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import MoonIcon from '../components/icons/MoonIcon';

const Sidebar = ({ navigateTo, activePage }) => {
    const { isSidebarOpen } = useAppContext();

    const navItems = [
        { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
        { id: 'seller-approval', icon: <SellerApprovalIcon />, label: 'Seller Approval' },
        { id: 'shop-approval', icon: <ShopApprovalIcon />, label: 'Shop Approval' },
        { id: 'product-approval', icon: <ProductApprovalIcon />, label: 'Product Approval' },
        { id: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics' },
        { id: 'payment-management', icon: <PaymentManagementIcon />, label: 'Payments' },
        { id: 'seller-management', icon: <SellerManagementIcon />, label: 'Seller Management' },
        { id: 'user-reports', icon: <UserReportsIcon />, label: 'User Reports' },
    { id: 'seller-messages', icon: <MessageSquareIcon />, label: 'Seller Messages' },
        // { id: 'notifications', icon: <BellIcon />, label: 'Notifications' }, // Uncomment if you want it in the sidebar
    ];

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    return (
        <aside className={`bg-[var(--component-bg)] text-[var(--component-text)] flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden border-r border-[var(--border-color)]`}>
            <div className="h-20 flex items-center justify-center text-2xl font-bold text-[var(--component-text)] border-b border-[var(--purple-light)]">
                <span className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: 'var(--chip-bg)' }}></span> {/* Logo Placeholder */}
                Tour On Go
            </div>
            <nav className="flex-1 px-4 py-6">
                {navItems.map(item => {
                    const isActive = activePage === item.id;
                    return (
                        <a
                            key={item.id}
                            href={`#/${item.id}`}
                            onClick={() => { navigateTo(item.id); }}
                            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 border
                                ${isActive ? 'bg-[var(--sidebar-active-bg)] text-white border-transparent' : 'bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] border-[var(--button-border-color)] hover:bg-[var(--sidebar-hover-bg)]'}`}
                            style={{}}
                        >
                            <span className="w-6 h-6 mr-4">{isActive && typeof window !== 'undefined' && document.body.classList.contains('dark') ? <MoonIcon /> : item.icon}</span>
                            <span className="truncate">{item.label}</span>
                        </a>
                    );
                })}
            </nav>
            <div className="px-4 py-6 border-t border-[var(--purple-light)]">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (isLoggingOut) return;
                        setIsLoggingOut(true);
                        setTimeout(() => navigateTo('logout'), 300);
                    }}
                    aria-disabled={isLoggingOut}
                    className={`flex items-center px-4 py-3 rounded-lg transition ${isLoggingOut ? 'animate-pulse opacity-70 cursor-not-allowed' : 'hover:bg-[var(--purple-light)]'}`}
                >
                    <span className="w-6 h-6 mr-4"><LogoutIcon /></span>
                    <span className="truncate">{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;