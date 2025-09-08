import { createSlice } from '@reduxjs/toolkit';

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem('seller_support_state');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
};

const persisted = typeof window !== 'undefined' ? loadPersisted() : null;

const sampleTickets = [
  {
    id: 'SUP-' + Math.floor(Date.now() / 1000),
    shopId: 'shop-2',
    subject: 'Question about payout delay',
    category: 'Payouts',
    priority: 'Medium',
    status: 'open',
    createdAt: new Date().toISOString().slice(0,10),
    closedAt: null,
    attachments: [],
    messages: [
      { id: Date.now()-2000, from: 'seller', date: new Date(Date.now()-2000).toISOString().slice(0,10), text: 'Hi team, my last payout seems delayed. Can you check?' }
    ]
  }
];

const initialState = persisted || {
  tickets: sampleTickets,
};

export const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    createTicket: (state, action) => {
      const { shopId, subject, category = 'Other', priority = 'Low', message = '', attachments = [] } = action.payload || {};
      if (!shopId || !subject) return;
      const id = 'SUP-' + Date.now();
      const now = new Date().toISOString().slice(0,10);
      state.tickets.unshift({
        id,
        shopId,
        subject,
        category,
        priority,
        status: 'open',
        createdAt: now,
        closedAt: null,
        attachments: attachments.map((f, i) => ({ id: i+1, name: f.name || String(f), size: f.size || 0 })),
        messages: message ? [{ id: Date.now(), from: 'seller', text: message, date: now }] : [],
      });
    },
    addMessage: (state, action) => {
      const { ticketId, from = 'seller', text, date = new Date().toISOString().slice(0,10) } = action.payload || {};
      const t = state.tickets.find(x => x.id === ticketId);
      if (!t || !text) return;
      t.messages = t.messages || [];
      t.messages.push({ id: Date.now(), from, text, date });
    },
    closeTicket: (state, action) => {
      const { ticketId, date = new Date().toISOString().slice(0,10) } = action.payload || {};
      const t = state.tickets.find(x => x.id === ticketId);
      if (t && t.status !== 'closed') { t.status = 'closed'; t.closedAt = date; }
    },
    reopenTicket: (state, action) => {
      const { ticketId } = action.payload || {};
      const t = state.tickets.find(x => x.id === ticketId);
      if (t && t.status === 'closed') { t.status = 'open'; t.closedAt = null; }
    },
    setTicketPriority: (state, action) => {
      const { ticketId, priority } = action.payload || {};
      const t = state.tickets.find(x => x.id === ticketId);
      if (t && priority) t.priority = priority;
    },
  }
});

export const { createTicket, addMessage, closeTicket, reopenTicket, setTicketPriority } = supportSlice.actions;
export default supportSlice.reducer;
