import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE, UPDATE_ORDER_STATUS } from '../constants/actionTypes';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { loading, items, error } = useSelector(s => s.orders);

  useEffect(() => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: items });
    } catch (e) {
      dispatch({ type: FETCH_ORDERS_FAILURE, payload: e.message || 'Failed to fetch orders' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const filtered = useMemo(() => (items || []).filter(o => [o.id, o.shop, o.customer].some(f => (f||'').toLowerCase().includes(searchTerm.toLowerCase()))), [items, searchTerm]);

  const updateStatus = (id, status) => {
    dispatch({ type: UPDATE_ORDER_STATUS, payload: { id, status } });
  };

  return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
      <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Orders</h2>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search orders..." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
              <th className="p-4">Order ID</th><th className="p-4">Shop</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="text-center p-8 text-red-500">{error}</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                <td className="p-4 font-mono">{o.id}</td>
                <td className="p-4">{o.shop}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 font-mono">${Number(o.total).toFixed(2)}</td>
                <td className="p-4">{o.date}</td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
                <td className="p-4 text-center space-x-2">
                  {['pending','processing','shipped','delivered','cancelled'].map(s => (
                    <Button key={s} color="gray" onClick={() => updateStatus(o.id, s)}>{s}</Button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
