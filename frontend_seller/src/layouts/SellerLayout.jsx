// This component renders the main layout for the seller panel, including the sidebar and header. It also handles the routing between pages.
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { DashboardIcon, PackageIcon, ShoppingCartIcon, DollarSignIcon, StoreIcon, StarIcon, LifeBuoyIcon } from '../components/icons/index.jsx';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import MyShopPage from '../pages/MyShopPage';
import ReviewsPage from '../pages/ReviewsPage';
import SupportPage from '../pages/SupportPage';
import PayoutsPage from '../pages/PayoutsPage';
import SettingsPage from '../pages/SettingsPage';
import { useDispatch } from 'react-redux';
import { setViewingOrder } from '../features/orderSlice';

const SellerLayout = ({ userInfo, onLogout, products, setProducts, orders, productFilter, setProductFilter, viewingProduct, setViewingProduct }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages = {
    'dashboard': { component: <DashboardPage setActivePage={setActivePage} setProductFilter={setProductFilter} />, title: 'Dashboard' },
  'products': { component: <ProductsPage products={products} setProducts={setProducts} filter={productFilter} setProductFilter={setProductFilter} viewingProduct={viewingProduct} setViewingProduct={setViewingProduct} />, title: 'Products' },
  'orders': { component: <OrdersPage orders={orders} onOpenDetails={(id) => { dispatch(setViewingOrder(id)); setActivePage('orderDetails'); }} />, title: 'Orders' },
  'orderDetails': { component: <OrderDetailsPage goBack={() => setActivePage('orders')} />, title: 'Order Details' },
    'shop': { component: <MyShopPage />, title: 'My Shop' },
    'reviews': { component: <ReviewsPage products={products} />, title: 'Reviews & Reports' },
  'payouts': { component: <PayoutsPage />, title: 'Payouts' },
    'support': { component: <SupportPage />, title: 'Support' },
    'settings': { component: <SettingsPage userInfo={userInfo} />, title: 'Settings' },
  };

  const navItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'products', icon: <PackageIcon />, label: 'Products' },
    { id: 'orders', icon: <ShoppingCartIcon />, label: 'Orders' },
    { id: 'shop', icon: <StoreIcon />, label: 'My Shop' },
    { id: 'reviews', icon: <StarIcon width={24} height={24} />, label: 'Reviews & Reports' },
    { id: 'payouts', icon: <DollarSignIcon />, label: 'Payouts' },
    { id: 'support', icon: <LifeBuoyIcon />, label: 'Support' },
  ];

  function navigateTo(page) {
    if (page === 'logout') { onLogout(); return; }
    setProductFilter('all');
    setActivePage(page);
  }

  return (
    <div className="flex h-screen bg-[var(--background-color)] text-[var(--text-color)] relative">
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-20" onClick={()=>setSidebarOpen(false)} aria-hidden="true"></div>}
      <Sidebar items={navItems} navigateTo={navigateTo} activePage={activePage} open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pages[activePage].title} userInfo={userInfo} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--surface-2)] p-8">
          <div className="page-section p-6">
            {pages[activePage].component}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
