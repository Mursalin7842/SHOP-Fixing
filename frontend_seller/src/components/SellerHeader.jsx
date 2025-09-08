import React from 'react';
import { BellIcon } from './icons/index.jsx';

const SellerHeader = ({ title, userInfo }) => (
  <header className="h-16 bg-[var(--component-bg)] text-[var(--component-text)] sticky top-0 z-10 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
    <h1 className="text-xl font-bold">{title}</h1>
    <div className="flex items-center gap-3">
      <button className="p-2 rounded-full hover:bg-[var(--surface-1)] relative">
        <BellIcon />
        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
      </button>
      <div>
        <p className="font-semibold text-right">{userInfo.name}</p>
        <p className="text-xs text-[var(--muted-text)] text-right">{userInfo.shopName}</p>
      </div>
    </div>
  </header>
);

export default SellerHeader;
