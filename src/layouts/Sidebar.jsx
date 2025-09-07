import React from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardIcon from '../components/icons/DashboardIcon';
import SellerApprovalIcon from '../components/icons/SellerApprovalIcon';
import ShopApprovalIcon from '../components/icons/ShopApprovalIcon';
import ProductApprovalIcon from '../components/icons/ProductApprovalIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import PaymentManagementIcon from '../components/icons/PaymentManagementIcon';
import SellerManagementIcon from '../components/icons/SellerManagementIcon';
import UserReportsIcon from '../components/icons/UserReportsIcon';
import LogoutIcon from '../components/icons/LogoutIcon';

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
    ];

    return (
        <aside className={`bg-[var(--component-bg)] text-white flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="h-20 flex items-center justify-center text-2xl font-bold text-white border-b border-[var(--purple-light)]">
                <span className="w-8 h-8 bg-gray-500 rounded-full mr-2"></span> {/* Logo Placeholder */}
                Tour On Go
            </div>
            <nav className="flex-1 px-4 py-6">
                {navItems.map(item => (
                    <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.id); }} className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${activePage === item.id ? 'bg-[var(--purple-light)]' : 'hover:bg-[var(--purple-light)]'}`}>
                        <span className="w-6 h-6 mr-4">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-6 border-t border-[var(--purple-light)]">
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('logout'); }} className="flex items-center px-4 py-3 rounded-lg hover:bg-[var(--purple-light)]">
                    <span className="w-6 h-6 mr-4"><LogoutIcon /></span>
                    <span className="truncate">Logout</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;