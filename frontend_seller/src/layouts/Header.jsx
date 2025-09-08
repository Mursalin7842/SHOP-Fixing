import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SunIcon, MoonIcon, StoreIcon, MenuIcon } from '../components/icons/index.jsx';
import { useAppContext } from '../context/AppContextUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveShop } from '../features/shopsSlice';
import { setAvatar } from '../features/profileSlice';
import { markAllRead, markRead } from '../features/notificationsSlice';

const Header = ({ title, userInfo = {}, onToggleSidebar }) => {
  const { theme, setTheme } = useAppContext();
  const dispatch = useDispatch();
  const { shops, activeShopId } = useSelector(s => s.shops);
  const notifications = useSelector(s => s.notifications.notifications);
  const unread = notifications.filter(n => !n.read).length;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  return (
  <header className="h-16 bg-[var(--component-bg)] text-[var(--component-text)] sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border-color)] elevated-header">
      <div className="flex items-center gap-3 min-w-0">
        <button className="p-2 rounded hover:bg-[var(--surface-1)]" onClick={()=>onToggleSidebar?.()} aria-label="Toggle sidebar">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold truncate">{title}</h1>
        {shops?.length ? (
          <div className="shop-selector sm:hidden flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border-color)] rounded px-2 py-1 w-[55vw]">
            <StoreIcon />
            <select aria-label="Active shop" value={activeShopId || ''} onChange={e => dispatch(setActiveShop(e.target.value || null))} className="bg-[var(--surface-1)] text-[var(--text-color)] text-sm focus:outline-none w-full rounded px-1 py-1">
              {shops.map(s => (
                <option key={s.id} value={s.id} disabled={s.status !== 'approved'}>
                  {s.name} {s.status !== 'approved' ? `(${s.status})` : ''}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {shops?.length ? (
          <div className="shop-selector hidden sm:flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border-color)] rounded px-2 py-1 min-w-[220px]">
            <StoreIcon />
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-wide text-[var(--muted-text)]">Active shop</span>
              <select value={activeShopId || ''} onChange={e => dispatch(setActiveShop(e.target.value || null))} className="bg-[var(--surface-1)] text-[var(--text-color)] text-sm focus:outline-none rounded px-1 py-1">
                {shops.map(s => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'approved'}>
                    {s.name} {s.status !== 'approved' ? `(${s.status})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme('light')} className={`p-2 rounded-full hover:bg-[var(--surface-1)] ${theme === 'light' ? 'ring-2 ring-[var(--purple-light)]' : ''}`} aria-label="Light mode">
            <SunIcon />
          </button>
          <button onClick={() => setTheme('dark')} className={`p-2 rounded-full hover:bg-[var(--surface-1)] ${theme === 'dark' ? 'ring-2 ring-[var(--purple-light)]' : ''}`} aria-label="Dark mode">
            <MoonIcon />
          </button>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-full hover:bg-[var(--surface-1)] relative" aria-label="Notifications">
            <BellIcon />
            {unread > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-80 card elevated-card bg-[var(--surface-1)] text-[var(--text-color)] border border-[var(--border-color)] shadow-xl z-20">
              <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="font-semibold">Notifications</div>
                <button className="text-xs text-blue-400 hover:underline" onClick={() => dispatch(markAllRead())}>Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-[var(--muted-text)]">No notifications</div>
                ) : notifications.map(n => (
                  <div key={n.id} className={`px-3 py-2 border-b border-[var(--border-color)] ${n.read ? '' : 'bg-[var(--surface-2)]'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="text-xs text-[var(--muted-text)]">{n.body}</div>
                      </div>
                      {!n.read && <button className="text-xs text-blue-400 hover:underline" onClick={() => dispatch(markRead(n.id))}>Read</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <UserMenu userInfo={userInfo} />
      </div>
    </header>
  );
};

export default Header;

const UserMenu = ({ userInfo }) => {
  const profile = useSelector(s => s.profile);
  const { shops, activeShopId } = useSelector(s => s.shops);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const activeShop = shops.find(s => s.id === activeShopId);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v=>!v)} className="flex items-center gap-2 p-1 rounded hover:bg-[var(--surface-1)]">
        {profile.avatarDataUrl ? (
          <img src={profile.avatarDataUrl} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-sm font-semibold">{(profile.name||'U').slice(0,1)}</div>
        )}
        <div className="text-left">
          <div className="text-sm font-semibold leading-4">{profile.name || userInfo?.name || 'User'}</div>
          <div className="text-[10px] text-[var(--muted-text)] leading-3">{activeShop ? activeShop.name : (userInfo?.shopName || '')}</div>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card elevated-card bg-[var(--surface-1)] text-[var(--text-color)] border border-[var(--border-color)] shadow-xl z-20 p-2">
          <div className="px-2 py-1 text-xs text-[var(--muted-text)]">Account</div>
          <label className="flex items-center gap-2 px-2 py-2 hover:bg-[var(--surface-2)] rounded cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
              const f=e.target.files?.[0]; if (!f) return; const reader=new FileReader(); reader.onload=()=>{ window.__STORE__?.dispatch?.(setAvatar(reader.result)); }; reader.readAsDataURL(f);
            }} />
            <span>Change Avatar</span>
          </label>
          <div className="px-2 py-2 hover:bg-[var(--surface-2)] rounded cursor-pointer">Profile</div>
          <div className="px-2 py-2 hover:bg-[var(--surface-2)] rounded cursor-pointer">Logout</div>
        </div>
      )}
    </div>
  );
};
