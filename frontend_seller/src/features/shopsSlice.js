import { createSlice } from '@reduxjs/toolkit';
import { MOCK_SHOPS_DATA } from '../api/mockData';

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem('seller_shops_state');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }
  return null;
};

const persisted = typeof window !== 'undefined' ? loadPersisted() : null;

const initialState = persisted || {
  shops: MOCK_SHOPS_DATA,
  activeShopId: (MOCK_SHOPS_DATA.find(s => s.status === 'approved') || MOCK_SHOPS_DATA[0] || {}).id || null,
};

export const shopsSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    setActiveShop: (state, action) => {
      state.activeShopId = action.payload || null;
    },
    requestShop: (state, action) => {
      const payload = action.payload || {};
      const id = `shop-${Date.now()}`;
      state.shops.push({
        id,
        name: payload.name,
        category: payload.category,
        description: payload.description,
        address: payload.address,
        phone: payload.phone || '',
        email: payload.email || '',
        taxId: payload.taxId || '',
        registrationNo: payload.registrationNo || '',
        documents: Array.isArray(payload.documents) ? payload.documents : [],
        attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
        status: 'pending',
        requestedAt: new Date().toISOString().slice(0,10),
      });
    },
    addShopDocument: (state, action) => {
      const { id, doc } = action.payload;
      const s = state.shops.find(x => x.id === id);
      if (s) {
        s.documents = s.documents || [];
        s.documents.push({ ...doc, id: doc.id || Date.now() });
      }
    },
  }
});

export const { setActiveShop, requestShop, addShopDocument } = shopsSlice.actions;

export default shopsSlice.reducer;
