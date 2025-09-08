// This component renders the main layout for the seller panel, including the sidebar and header. It also handles the routing between pages.
import React, { useState } from 'react';
import SellerSidebar from './SellerSidebar';
import SellerHeader from './SellerHeader';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import MyShopPage from '../pages/MyShopPage';
import ReviewsPage from '../pages/ReviewsPage';
import SupportPage from '../pages/SupportPage';
import SettingsPage from '../pages/SettingsPage';

const SellerLayout = ({ userInfo, onLogout, products, setProducts, orders, productFilter, setProductFilter, viewingProduct, setViewingProduct }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const pages = {
    'dashboard': { component: <DashboardPage setActivePage={setActivePage} setProductFilter={setProductFilter} />, title: 'Dashboard' },
    'products': { component: <ProductsPage products={products} setProducts={setProducts} filter={productFilter} viewingProduct={viewingProduct} setViewingProduct={setViewingProduct} />, title: 'Products' },
    'orders': { component: <OrdersPage orders={orders} />, title: 'Orders' },
    'shop': { component: <MyShopPage />, title: 'My Shop' },
    'reviews': { component: <ReviewsPage products={products} />, title: 'Reviews & Reports' },
    'payouts': { component: <div>Payouts Page</div>, title: 'Payouts' },
    'support': { component: <SupportPage />, title: 'Support' },
    'settings': { component: <SettingsPage userInfo={userInfo} />, title: 'Settings' },
  };

  function navigateTo(page) {
    if (page === 'logout') { onLogout(); return; }
    setProductFilter('all');
    setActivePage(page);
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SellerSidebar navigateTo={navigateTo} activePage={activePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader title={pages[activePage].title} userInfo={userInfo} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-8">{pages[activePage].component}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
