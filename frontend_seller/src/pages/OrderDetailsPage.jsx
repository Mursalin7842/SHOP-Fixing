import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { addCustomerMessage, cancelOrder, createShipment, addTrackingEvent, markDelivered, acceptOrder, rejectOrder, setViewingOrder, updateOrderItemQty, removeOrderItem, setPartialFulfillment, autoSuggestFulfillment } from '../features/orderSlice';

const OrderDetailsPage = ({ goBack }) => {
  const dispatch = useDispatch();
  const { orders, viewingOrderId } = useSelector(s => s.orders);
  const products = useSelector(s => s.products.products);
  const order = useMemo(() => orders.find(o => o.id === viewingOrderId) || orders[0], [orders, viewingOrderId]);

  const [message, setMessage] = useState('');
  const [shipForm, setShipForm] = useState({ carrier: 'UPS', trackingNumber: '' });
  const [newEvent, setNewEvent] = useState('');

  const productStockFor = (name, color, size) => {
    const p = products.find(pr => pr.name === name);
    if (!p) return 0;
    if (p.variants && (color || size)) {
      const v = p.variants.find(v => (!color || v.color === color) && (!size || v.size === size));
      if (v && typeof v.stock === 'number') return v.stock;
    }
    return typeof p.stock === 'number' ? p.stock : 0;
  };

  const hasShortages = !!(order?.items || []).find(it => productStockFor(it.productName, it.color, it.size) < it.qty);

  const handleBack = () => {
    dispatch(setViewingOrder(null));
    if (goBack) goBack();
  };

  if (!order) return (
    <div className="card elevated-card p-6">
      <div className="mb-4">Order not found.</div>
      <Button onClick={handleBack}>Back to Orders</Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order {order.id}</h2>
          <div className="text-sm text-[var(--muted-text)]">Placed {order.date}</div>
        </div>
        <Button color="gray" onClick={handleBack}>Back</Button>
      </div>

      {(order.status === 'New') && (
        <div className="p-4 rounded border border-[var(--border-color)] bg-yellow-900/20">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="font-semibold">Awaiting your decision</div>
            <div className="flex gap-2">
              <Button color="gray" onClick={() => dispatch(autoSuggestFulfillment(order.id))}>Auto Suggest</Button>
            </div>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
    <Button color="green" onClick={() => dispatch(acceptOrder({ id: order.id }))} disabled={(order.items?.length || 0) === 0}>Accept{order.partial ? ' (Partial)' : ''}</Button>
            <Button color="red" onClick={() => dispatch(rejectOrder({ id: order.id, reason: 'Out of stock' }))}>Reject</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card elevated-card p-6">
          <div className="flex items-start justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold">Items & Stock Check</h3>
            {hasShortages && (
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!order.partial} onChange={e => dispatch(setPartialFulfillment({ id: order.id, partial: e.target.checked }))} />
                Allow partial fulfillment
              </label>
            )}
          </div>
          <div className="space-y-3">
            {order.items?.map((it, idx) => {
              const stock = productStockFor(it.productName, it.color, it.size);
              const short = stock < it.qty;
              return (
                <div key={idx} className={`p-3 rounded bg-[var(--surface-2)] ${short ? 'border border-yellow-700/50' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{it.productName}</div>
                      <div className="text-sm text-[var(--muted-text)]">Qty x{it.qty}{it.color ? ` • Color: ${it.color}` : ''}{it.size ? ` • Size: ${it.size}` : ''}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[var(--muted-text)]">Current Stock</div>
                      <div className={`font-mono ${short ? 'text-yellow-300' : ''}`}>{stock}</div>
                    </div>
                  </div>
                  {short && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-yellow-300">Insufficient stock</span>
                      <input type="number" min="0" value={it.qty} onChange={e => dispatch(updateOrderItemQty({ id: order.id, itemIndex: idx, qty: e.target.value }))} className="w-24 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
                      <Button color="gray" onClick={() => dispatch(updateOrderItemQty({ id: order.id, itemIndex: idx, qty: Math.max(0, Math.min(stock, it.qty)) }))}>Cap to stock</Button>
                      <Button color="red" onClick={() => dispatch(removeOrderItem({ id: order.id, itemIndex: idx, reason: 'Out of stock' }))}>Remove item</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card elevated-card p-6">
          <h3 className="text-lg font-bold mb-4">Customer & Shipping</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-[var(--muted-text)]">Customer:</span> {order.customerInfo?.name || order.customer || '—'}</div>
            <div><span className="text-[var(--muted-text)]">Email:</span> {order.customerInfo?.email || '—'}</div>
            <div><span className="text-[var(--muted-text)]">Phone:</span> {order.customerInfo?.phone || '—'}</div>
            <div className="mt-3 text-[var(--muted-text)]">Ship To</div>
            {typeof order.customerInfo?.shippingAddress === 'string' ? (
              <pre className="whitespace-pre-wrap text-[var(--text-color)]">{order.customerInfo.shippingAddress}</pre>
            ) : order.shippingAddress ? (
              <div>
                <div>{order.shippingAddress?.name}</div>
                <div>{order.shippingAddress?.line1}</div>
                <div>{`${order.shippingAddress?.city || ''}${order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} ${order.shippingAddress?.zip || ''}`.trim()}</div>
                <div>{order.shippingAddress?.country}</div>
              </div>
            ) : (
              <div>—</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card elevated-card p-6">
          <h3 className="text-lg font-bold mb-3">Message Customer</h3>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message to the customer..." className="w-full h-24 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
          <div className="mt-2 flex justify-end"><Button color="primary" onClick={() => { if (!message.trim()) return; dispatch(addCustomerMessage({ id: order.id, message })); setMessage(''); }}>Send</Button></div>
          {order.customerMessages?.length ? (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
              {order.customerMessages.map(m => (
                <div key={m.id} className="p-2 rounded bg-[var(--surface-2)] text-sm">
                  <span className="text-[var(--muted-text)]">{new Date(m.date).toLocaleString()}</span> — {m.message}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-2 card elevated-card p-6">
          <h3 className="text-lg font-bold mb-3">Fulfillment</h3>
          {order.shipping ? (
            <div className="space-y-2">
              <div className="p-3 rounded bg-[var(--surface-2)]">{order.shipping.carrier} • {order.shipping.trackingNumber}</div>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                {order.shipping.events?.map((ev, i) => (
                  <div key={i} className="text-sm text-[var(--muted-text)]">{ev.date} — {ev.text}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newEvent} onChange={e => setNewEvent(e.target.value)} placeholder="Add tracking event" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
                <Button color="gray" onClick={() => { if (!newEvent.trim()) return; dispatch(addTrackingEvent({ id: order.id, text: newEvent })); setNewEvent(''); }}>Add</Button>
              </div>
              {order.status !== 'Completed' && (
                <Button color="green" onClick={() => dispatch(markDelivered({ id: order.id }))}>Mark Delivered</Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input value={shipForm.carrier} onChange={e => setShipForm({ ...shipForm, carrier: e.target.value })} placeholder="Carrier" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
                <input value={shipForm.trackingNumber} onChange={e => setShipForm({ ...shipForm, trackingNumber: e.target.value })} placeholder="Tracking #" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
              </div>
              <Button color="primary" onClick={() => { if (!shipForm.trackingNumber.trim()) return; dispatch(createShipment({ id: order.id, ...shipForm })); }}>Create Shipment</Button>
            </div>
          )}
          {order.status !== 'Shipped' && order.status !== 'Completed' && order.status !== 'Canceled' && (
            <Button color="red" className="mt-3" onClick={() => dispatch(cancelOrder({ id: order.id, reason: 'Seller canceled before shipping' }))}>Cancel Order</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
 
