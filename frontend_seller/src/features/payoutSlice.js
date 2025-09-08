// Manages seller payouts: balances, pending requests, and history
import { createSlice, nanoid } from '@reduxjs/toolkit';

// Normalize legacy/localStorage state to current shape
function normalizeState(s) {
  const base = s && typeof s === 'object' ? { ...s } : {};
  base.balance = base.balance || { totalEarned: 0, available: 0, pendingClearance: 0 };
  base.pending = Array.isArray(base.pending) ? base.pending : [];
  base.history = Array.isArray(base.history) ? base.history : [];
  if (!base.paymentMethods || typeof base.paymentMethods !== 'object') {
    base.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
  } else {
    base.paymentMethods.banks = Array.isArray(base.paymentMethods.banks) ? base.paymentMethods.banks : [];
    base.paymentMethods.mobileWallets = Array.isArray(base.paymentMethods.mobileWallets) ? base.paymentMethods.mobileWallets : [];
    base.paymentMethods.cards = Array.isArray(base.paymentMethods.cards) ? base.paymentMethods.cards : [];
  }
  return base;
}

const loadFromStorage = () => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('seller_payouts_state');
  const parsed = raw ? JSON.parse(raw) : null;
  return parsed ? normalizeState(parsed) : null;
  } catch { return null; }
};

const initialState = loadFromStorage() || normalizeState({
  balance: {
    totalEarned: 27600,
    available: 12450,
    pendingClearance: 3200,
  },
  pending: [],
  history: [
    { id: 'PO-1001', amount: 5000, method: 'Bank Transfer', status: 'Paid', requestedAt: '2025-08-15', processedAt: '2025-08-17' },
  ],
  paymentMethods: { banks: [], mobileWallets: [], cards: [] },
});

const payoutsSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {
    // internal guard
    _ensurePM(state) {
      if (!state.paymentMethods || typeof state.paymentMethods !== 'object') {
        state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      } else {
        if (!Array.isArray(state.paymentMethods.banks)) state.paymentMethods.banks = [];
        if (!Array.isArray(state.paymentMethods.mobileWallets)) state.paymentMethods.mobileWallets = [];
        if (!Array.isArray(state.paymentMethods.cards)) state.paymentMethods.cards = [];
      }
    },
    // Payment methods management (seller-controlled)
    addBankAccount: {
      reducer(state, action) {
        // guard legacy state
        if (!state.paymentMethods || !Array.isArray(state.paymentMethods.banks)) {
          state.paymentMethods = state.paymentMethods || {};
          state.paymentMethods.banks = [];
        }
  const acc = action.payload;
  state.paymentMethods.banks.unshift(acc);
        if (!state.paymentMethods.banks.some(b => b.isDefault)) {
          state.paymentMethods.banks[0].isDefault = true;
        }
      },
      prepare({ bankName, accountNumber, routingNumber, holderName }) {
        return { payload: { id: nanoid(6), bankName, accountNumber, routingNumber, holderName, isDefault: false } };
      }
    },
    removeBankAccount(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      const list = state.paymentMethods.banks || [];
      const wasDefault = (list.find(b => b.id === id) || {}).isDefault;
      state.paymentMethods.banks = list.filter(b => b.id !== id);
      if (wasDefault && state.paymentMethods.banks[0]) state.paymentMethods.banks[0].isDefault = true;
    },
    setDefaultBankAccount(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      (state.paymentMethods.banks || []).forEach(b => b.isDefault = (b.id === id));
    },
    addMobileWallet: {
      reducer(state, action) {
        if (!state.paymentMethods || !Array.isArray(state.paymentMethods.mobileWallets)) {
          state.paymentMethods = state.paymentMethods || {};
          state.paymentMethods.mobileWallets = [];
        }
        const w = action.payload;
        state.paymentMethods.mobileWallets.unshift(w);
        if (!state.paymentMethods.mobileWallets.some(x => x.isDefault)) {
          state.paymentMethods.mobileWallets[0].isDefault = true;
        }
      },
      prepare({ provider, walletNumber, holderName }) {
        return { payload: { id: nanoid(6), provider, walletNumber, holderName, isDefault: false } };
      }
    },
    removeMobileWallet(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      const list = state.paymentMethods.mobileWallets || [];
      const wasDefault = (list.find(b => b.id === id) || {}).isDefault;
      state.paymentMethods.mobileWallets = list.filter(b => b.id !== id);
      if (wasDefault && state.paymentMethods.mobileWallets[0]) state.paymentMethods.mobileWallets[0].isDefault = true;
    },
    setDefaultMobileWallet(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      (state.paymentMethods.mobileWallets || []).forEach(w => w.isDefault = (w.id === id));
    },
    addCard: {
      reducer(state, action) {
        if (!state.paymentMethods || !Array.isArray(state.paymentMethods.cards)) {
          state.paymentMethods = state.paymentMethods || {};
          state.paymentMethods.cards = [];
        }
        const c = action.payload;
        state.paymentMethods.cards.unshift(c);
        if (!state.paymentMethods.cards.some(x => x.isDefault)) {
          state.paymentMethods.cards[0].isDefault = true;
        }
      },
      prepare({ brand, cardNumber, holderName, expMonth, expYear }) {
        const num = String(cardNumber || '');
        const last4 = num.slice(-4);
        return { payload: { id: nanoid(6), brand, last4, holderName, expMonth, expYear, isDefault: false } };
      }
    },
    removeCard(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      const list = state.paymentMethods.cards || [];
      const wasDefault = (list.find(b => b.id === id) || {}).isDefault;
      state.paymentMethods.cards = list.filter(b => b.id !== id);
      if (wasDefault && state.paymentMethods.cards[0]) state.paymentMethods.cards[0].isDefault = true;
    },
    setDefaultCard(state, action) {
      if (!state.paymentMethods) state.paymentMethods = { banks: [], mobileWallets: [], cards: [] };
      const id = action.payload;
      (state.paymentMethods.cards || []).forEach(c => c.isDefault = (c.id === id));
    },
    requestPayout: {
      reducer(state, action) {
        const { id, amount, method, requestedAt } = action.payload;
        if (amount <= 0 || amount > state.balance.available) return; // ignore invalid
        state.balance.available -= amount;
        state.pending.unshift({ id, amount, method, requestedAt });
      },
      prepare({ amount, method }) {
        return {
          payload: {
            id: nanoid(6),
            amount: Number(amount),
            method,
            requestedAt: new Date().toISOString().slice(0, 10),
          },
        };
      },
    },
    cancelPayout(state, action) {
      const id = action.payload;
      const idx = state.pending.findIndex(p => p.id === id);
      if (idx !== -1) {
        const req = state.pending[idx];
        // refund
        state.balance.available += req.amount;
        state.pending.splice(idx, 1);
        state.history.unshift({ ...req, status: 'Cancelled', processedAt: new Date().toISOString().slice(0, 10) });
      }
    },
    markPayoutPaid(state, action) {
      const id = action.payload;
      const idx = state.pending.findIndex(p => p.id === id);
      if (idx !== -1) {
        const req = state.pending[idx];
        state.pending.splice(idx, 1);
        state.history.unshift({ ...req, status: 'Paid', processedAt: new Date().toISOString().slice(0, 10) });
      }
    },
  },
});

export const { requestPayout, cancelPayout, markPayoutPaid, addBankAccount, removeBankAccount, setDefaultBankAccount, addMobileWallet, removeMobileWallet, setDefaultMobileWallet, addCard, removeCard, setDefaultCard } = payoutsSlice.actions;
export default payoutsSlice.reducer;
