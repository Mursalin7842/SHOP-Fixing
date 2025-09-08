import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    { id: nanoid(8), title: 'New order received', body: 'Order ORD-106 from Alice', createdAt: new Date().toISOString(), read: false },
    { id: nanoid(8), title: 'Payout processed', body: 'Your payout has been processed', createdAt: new Date().toISOString(), read: false },
    { id: nanoid(8), title: 'Product approved', body: 'Cyber-Knit Jacket is now approved', createdAt: new Date().toISOString(), read: true },
  ],
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      const n = action.payload;
      state.notifications.unshift({ id: nanoid(8), read: false, createdAt: new Date().toISOString(), ...n });
    },
    markRead(state, action) {
      const id = action.payload;
      const n = state.notifications.find(x => x.id === id);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach(n => { n.read = true; });
    },
    clearAll(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, markRead, markAllRead, clearAll } = slice.actions;
export default slice.reducer;
