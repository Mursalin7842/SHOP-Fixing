import React from 'react';
import { SettingsIcon, LogoutIcon } from '../components/icons/index.jsx';

const Sidebar = ({ items = [], navigateTo, activePage, open = true }) => (
  <aside className={`${open ? 'flex fixed inset-y-0 left-0 w-64 z-30' : 'hidden'} md:static md:flex ${open ? 'md:w-64' : 'md:w-16'} overflow-hidden bg-[var(--component-bg)] text-[var(--component-text)] flex-col border-r border-[var(--border-color)] transition-all duration-200`}>
    <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-[var(--border-color)]">{open ? 'Seller Panel' : 'SP'}</div>
    <nav className="flex-1 px-3 py-4">
      {items.map(item => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => { e.preventDefault(); navigateTo(item.id); }}
          className={`flex items-center px-3 py-2 mb-2 rounded-md transition-colors duration-200 border ${open ? '' : 'justify-center'}
            ${activePage === item.id
              ? '!bg-[var(--button-primary)] !text-white border-transparent'
              : 'bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)]'}`}
        >
          <span className="w-6 h-6 mr-3 text-inherit">{item.icon}</span>{open && <span className="text-inherit">{item.label}</span>}
        </a>
      ))}
    </nav>
    <div className="px-3 py-4 border-t border-[var(--border-color)]">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigateTo('settings'); }}
        className={`flex items-center px-3 py-2 mb-2 rounded-md border bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)] ${open ? '' : 'justify-center'}`}
        aria-label="Settings"
        title="Settings"
      >
        <span className={`w-6 h-6 ${open ? 'mr-3' : ''} text-inherit`}><SettingsIcon /></span>{open && <span>Settings</span>}
      </a>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigateTo('logout'); }}
        className={`flex items-center px-3 py-2 rounded-md border bg-[var(--sidebar-item-bg)] text-[var(--sidebar-link-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-text)] border-[var(--button-border-color)] ${open ? '' : 'justify-center'}`}
        aria-label="Logout"
        title="Logout"
      >
        <span className={`w-6 h-6 ${open ? 'mr-3' : ''} text-inherit`}><LogoutIcon /></span>{open && <span>Logout</span>}
      </a>
    </div>
  </aside>
);

export default Sidebar;
