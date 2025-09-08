import React, { useMemo, useState } from 'react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { acceptOrder, rejectOrder } from '../features/orderSlice';

const statusOptions = ['All','New','Processing','Shipped','Completed','Canceled'];

const OrdersPage = ({ orders, onOpenDetails }) => {
  const dispatch = useDispatch();
  const activeShopId = useSelector(s => s.shops.activeShopId);
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  //

  const filtered = useMemo(() => orders.filter(o =>
    (!activeShopId || o.shopId === activeShopId) &&
    (status === 'All' || o.status === status) &&
    (query.trim() === '' || o.id.toLowerCase().includes(query.toLowerCase()) || (o.customer||'').toLowerCase().includes(query.toLowerCase()))
  ), [orders, status, query, activeShopId]);

  return (
    <div className="rounded-lg shadow-lg animate-fade-in card elevated-card">
      <div className="p-4 md:p-6 border-b border-[var(--border-color)]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Orders</h2>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(s => (
                <div key={s} className="px-3 py-2 rounded bg-[var(--surface-2)] text-center">
                  <div className="text-[10px] uppercase tracking-wide text-[var(--muted-text)]">{s}</div>
                  <div className="text-sm font-semibold text-[var(--text-color)]">{orders.filter(o => (!activeShopId || o.shopId===activeShopId) && (s==='All'? true : o.status===s)).length}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={status} onChange={e => setStatus(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]">
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by ID or customer" className="flex-1 min-w-[240px] bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--table-header-bg)]">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Shipment</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                <td className="p-4 font-mono">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 text-sm">
                  {order.shipping ? (
                    <div className="space-y-1">
                      <div>{order.shipping.carrier} • {order.shipping.trackingNumber}</div>
                      <div className="text-[var(--muted-text)]">Shipped {order.shipping.shippedAt}</div>
                    </div>
                  ) : (
                    <span className="text-[var(--muted-text)]">Not shipped</span>
                  )}
                </td>
                <td className="p-4 text-right font-mono">${order.total.toFixed(2)}</td>
                <td className="p-4 text-right space-x-2">
                  {order.status === 'New' && (
                    <>
                      <Button color="green" onClick={() => dispatch(acceptOrder({ id: order.id }))}>Accept</Button>
                      <Button color="red" onClick={() => dispatch(rejectOrder({ id: order.id, reason: 'Out of stock' }))}>Reject</Button>
                    </>
                  )}
                  <Button color="gray" onClick={() => onOpenDetails?.(order.id)}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default OrdersPage;
