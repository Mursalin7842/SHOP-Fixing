// This is the main application component. It handles the authentication state and renders the correct layout based on the auth state.
import React, { useState, useEffect } from 'react';
import SellerLayout from './layouts/SellerLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PendingApprovalPage from './pages/PendingApprovalPage';

import { useSelector, useDispatch } from 'react-redux';
import { addProduct, setProductFilter, setViewingProduct } from './features/productSlice';

function SellerApp() {
  const [authState, setAuthState] = useState('unauthenticated'); // unauthenticated, registering, pending_approval, authenticated
  const [userInfo, setUserInfo] = useState(null);

  const products = useSelector((state) => state.products.products);
  const orders = useSelector((state) => state.orders.orders);
  const productFilter = useSelector((state) => state.products.filter);
  const viewingProduct = useSelector((state) => state.products.viewingProduct);
  const dispatch = useDispatch();

  const handleLogin = (user) => { setUserInfo(user); setAuthState('authenticated'); };
  const handleLogout = () => { setUserInfo(null); setAuthState('unauthenticated'); };
  const handleRegister = () => setAuthState('pending_approval');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  if (authState === 'unauthenticated') return <LoginPage onLogin={handleLogin} showRegister={() => setAuthState('registering')} />;
  if (authState === 'registering') return <RegisterPage onRegister={handleRegister} showLogin={() => setAuthState('unauthenticated')} />;
  if (authState === 'pending_approval') return <PendingApprovalPage onLogout={handleLogout} />;
  if (authState === 'authenticated') return <SellerLayout userInfo={userInfo} onLogout={handleLogout} products={products} setProducts={(p) => dispatch(addProduct(p))} orders={orders} productFilter={productFilter} setProductFilter={(f) => dispatch(setProductFilter(f))} viewingProduct={viewingProduct} setViewingProduct={(p) => dispatch(setViewingProduct(p))} />;

  return null;
}

export default SellerApp;
