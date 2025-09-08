import React from 'react';
import {
  DashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  SettingsIcon,
  LogoutIcon,
  StarIcon,
  StoreIcon,
  LifeBuoyIcon,
} from './icons/index.jsx';

const SellerSidebar = ({ navigateTo, activePage }) => {
  const navItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'products', icon: <PackageIcon />, label: 'Products' },
    { id: 'orders', icon: <ShoppingCartIcon />, label: 'Orders' },
    { id: 'shop', icon: <StoreIcon />, label: 'My Shop' },
    { id: 'reviews', icon: <StarIcon width={24} height={24} />, label: 'Reviews & Reports' },
    { id: 'payouts', icon: <DollarSignIcon />, label: 'Payouts' },
    { id: 'support', icon: <LifeBuoyIcon />, label: 'Support' },
  ];
  return (
    <aside className="w-64 bg-[var(--component-bg)] text-[var(--component-text)] flex-col hidden md:flex border-r border-[var(--border-color)]">
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-[var(--border-color)]">Seller Panel</div>
  <nav className="flex-1 px-3 py-4">
        {navItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); navigateTo(item.id); }}
    className={`flex items-center px-3 py-2 mb-2 rounded-md transition-colors duration-200 border ${activePage === item.id ? 'bg-[var(--button-primary)] text-white border-transparent' : 'bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)]'}`}
          >
            <span className="w-6 h-6 mr-3">{item.icon}</span><span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border-color)]">
    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('settings'); }} className="flex items-center px-3 py-2 mb-2 rounded-md border bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)]"><SettingsIcon className="w-6 h-6 mr-3" /><span>Settings</span></a>
    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('logout'); }} className="flex items-center px-3 py-2 rounded-md border bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)]"><LogoutIcon className="w-6 h-6 mr-3" /><span>Logout</span></a>
      </div>
    </aside>
  );
};

export default SellerSidebar;
