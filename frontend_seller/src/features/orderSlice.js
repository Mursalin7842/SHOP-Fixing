// This slice manages the state for orders.
import { createSlice } from '@reduxjs/toolkit';
import { MOCK_ORDERS_DATA } from '../api/mockData';

const initialState = {
  orders: MOCK_ORDERS_DATA,
  viewingOrderId: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setViewingOrder: (state, action) => {
      state.viewingOrderId = action.payload || null;
    },
    addCustomerMessage: (state, action) => {
      const { id, message, date = new Date().toISOString() } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.customerMessages = o.customerMessages || [];
        o.customerMessages.push({ id: Date.now(), message, date });
      }
    },
    messageCustomer: (state, action) => {
      const { id, text, date = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.messages = o.messages || [];
        o.messages.push({ id: Date.now(), text, date, from: 'seller' });
      }
    },
    acceptOrder: (state, action) => {
      const { id } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (!o) return;
      if (o.items && o.items.length === 0) {
        o.status = 'Canceled';
        o.cancelReason = 'No items available to fulfill';
        o.canceledAt = new Date().toISOString();
        return;
      }
      if (o.status === 'New' || o.status === 'Processing') {
        o.status = 'Processing';
        o.acceptedAt = new Date().toISOString();
      }
    },
    rejectOrder: (state, action) => {
      const { id, reason = 'Rejected by seller' } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o && (o.status === 'New' || o.status === 'Processing')) {
        o.status = 'Canceled';
        o.cancelReason = reason;
        o.canceledAt = new Date().toISOString();
      }
    },
    setOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) o.status = status;
    },
    addOrderNote: (state, action) => {
      const { id, note, date = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.notes = o.notes || [];
        o.notes.push({ id: Date.now(), note, date });
      }
    },
    createShipment: (state, action) => {
      const { id, carrier, trackingNumber, shippedAt = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.shipping = { carrier, trackingNumber, shippedAt, events: [{ date: shippedAt, text: 'Shipment created' }] };
        o.status = 'Shipped';
      }
    },
    addTrackingEvent: (state, action) => {
      const { id, text, date = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.shipping = o.shipping || { carrier: '', trackingNumber: '', shippedAt: date, events: [] };
        o.shipping.events = o.shipping.events || [];
        o.shipping.events.push({ date, text });
      }
    },
    markDelivered: (state, action) => {
      const { id, deliveredAt = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) {
        o.deliveredAt = deliveredAt;
        o.status = 'Completed';
        if (o.shipping) {
          o.shipping.events = o.shipping.events || [];
          o.shipping.events.push({ date: deliveredAt, text: 'Delivered' });
        }
      }
    },
    cancelOrder: (state, action) => {
      const { id, reason = 'Canceled by seller', date = new Date().toISOString().slice(0,10) } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o && o.status !== 'Shipped' && o.status !== 'Completed') {
        o.status = 'Canceled';
        o.canceledAt = date;
        o.cancelReason = reason;
      }
    },
    updateOrderItemQty: (state, action) => {
      const { id, itemIndex, qty } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (!o || !o.items || itemIndex < 0 || itemIndex >= o.items.length) return;
      const q = Math.max(0, Number(qty) || 0);
      o.items[itemIndex].qty = q;
    },
    removeOrderItem: (state, action) => {
      const { id, itemIndex, reason = 'Removed (out of stock)' } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (!o || !o.items || itemIndex < 0 || itemIndex >= o.items.length) return;
      const removed = o.items.splice(itemIndex, 1)[0];
      o.removedItems = o.removedItems || [];
      o.removedItems.push({ ...removed, removedAt: new Date().toISOString(), reason });
      // add a lightweight note
      o.notes = o.notes || [];
      o.notes.push({ id: Date.now(), note: `Removed item '${removed.productName}' (${reason})`, date: new Date().toISOString().slice(0,10) });
    },
    setPartialFulfillment: (state, action) => {
      const { id, partial = true } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) o.partial = !!partial;
    },
    setOrderTotal: (state, action) => {
      const { id, total } = action.payload;
      const o = state.orders.find(ord => ord.id === id);
      if (o) o.total = Number(total) || 0;
    },
  },
});

export const { setViewingOrder, addCustomerMessage, messageCustomer, acceptOrder, rejectOrder, setOrderStatus, addOrderNote, createShipment, addTrackingEvent, markDelivered, cancelOrder, updateOrderItemQty, removeOrderItem, setPartialFulfillment, setOrderTotal } = orderSlice.actions;

// Thunk: auto suggest partial fulfillment by capping to stock and removing zero-stock items
export const autoSuggestFulfillment = (id) => (dispatch, getState) => {
  const state = getState();
  const ordersState = state.orders;
  const productsState = state.products;
  const order = ordersState.orders.find(o => o.id === id);
  if (!order || !Array.isArray(order.items)) return;

  const findStock = (name, color, size) => {
    const p = productsState.products.find(pr => pr.name === name);
    if (!p) return 0;
    if (Array.isArray(p.variants) && (color || size)) {
      const v = p.variants.find(v => (!color || v.color === color) && (!size || v.size === size));
      if (v && typeof v.stock === 'number') return v.stock;
    }
    return typeof p.stock === 'number' ? p.stock : 0;
  };
  const findPrice = (name) => {
    const p = productsState.products.find(pr => pr.name === name);
    return p ? Number(p.price) || 0 : 0;
  };

  let removed = 0;
  let reduced = 0;
  for (let i = order.items.length - 1; i >= 0; i--) {
    const it = order.items[i];
    const stock = findStock(it.productName, it.color, it.size);
    if (stock <= 0) {
      dispatch(removeOrderItem({ id, itemIndex: i, reason: 'Out of stock' }));
      removed++;
    } else if (it.qty > stock) {
      dispatch(updateOrderItemQty({ id, itemIndex: i, qty: stock }));
      reduced++;
    }
  }

  const updatedOrder = getState().orders.orders.find(o => o.id === id);
  const newTotal = (updatedOrder.items || []).reduce((sum, it) => sum + (findPrice(it.productName) * (Number(it.qty) || 0)), 0);
  const oldTotal = Number(order.total) || 0;
  if (removed > 0 || reduced > 0) {
    dispatch(setPartialFulfillment({ id, partial: true }));
    dispatch(setOrderTotal({ id, total: newTotal }));
    dispatch(addOrderNote({ id, note: `Auto-suggest applied: ${removed} removed, ${reduced} adjusted. Total ${oldTotal.toFixed(2)} -> ${newTotal.toFixed(2)}` }));
  }
};

export default orderSlice.reducer;
