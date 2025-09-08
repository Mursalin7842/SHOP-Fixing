// This slice manages the state for products, including the product list, filter, and the product being viewed.
import { createSlice } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS_DATA } from '../api/mockData';

const initialState = {
  products: MOCK_PRODUCTS_DATA,
  filter: 'all',
  viewingProduct: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    addReviewResponse: (state, action) => {
      const { productId, reviewId, text, date = new Date().toISOString().slice(0,10) } = action.payload || {};
      const p = state.products.find(pr => pr.id === productId);
      if (!p || !Array.isArray(p.reviews)) return;
      const r = p.reviews.find(rv => rv.id === reviewId);
      if (!r) return;
      r.sellerResponse = { text, date };
    },
    resolveReport: (state, action) => {
      const { productId, reportId, note = '' , date = new Date().toISOString().slice(0,10)} = action.payload || {};
      const p = state.products.find(pr => pr.id === productId);
      if (!p || !Array.isArray(p.reports)) return;
      const rep = p.reports.find(r => r.id === reportId);
      if (!rep) return;
      rep.status = 'resolved';
      rep.resolvedAt = date;
      if (note) rep.resolutionNote = note;
    },
    updateStock: (state, action) => {
      const { id, stock } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (p) {
        // If variants exist, base stock is auto-calculated from variants; ignore manual base updates
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          const sum = p.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
          p.stock = Number.isFinite(sum) ? sum : 0;
        } else {
          p.stock = Math.max(0, Number(stock) || 0);
        }
      }
    },
    updateVariantStock: (state, action) => {
      const { id, variantIndex, stock } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (!p || !Array.isArray(p.variants)) return;
      if (variantIndex < 0 || variantIndex >= p.variants.length) return;
      const n = Math.max(0, Number(stock) || 0);
      p.variants[variantIndex].stock = n;
      // If product has variants, keep base stock in sync as sum of variants
  const sum = p.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
  if (Number.isFinite(sum)) p.stock = sum;
    },
    requestEdit: (state, action) => {
      const { id, changes } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (!p) return;
      // Determine if changes are major (require admin approval)
      const majorFields = ['name','category','price','description','images','specifications','imageUrl','variants'];
      const isMajor = Object.keys(changes).some(k => majorFields.includes(k));
      if (isMajor) {
        // Store only changed fields for admin to review
        p.pendingChanges = { ...(p.pendingChanges || {}), ...changes };
        // Move to pending (or stay in modification -> pending)
        p.status = 'pending';
      } else {
        Object.assign(p, changes);
      }
    },
    cancelPendingEdit: (state, action) => {
      const { id } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (p && p.pendingChanges) {
        delete p.pendingChanges;
        // Do not change status here; seller simply cancels their own draft
      }
    },
    approvePendingChanges: (state, action) => {
      const { id } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (p && p.pendingChanges) {
        Object.assign(p, p.pendingChanges);
        delete p.pendingChanges;
        p.status = 'approved';
        // If variants were changed/added, recalc base stock from variants
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          const sum = p.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
          p.stock = Number.isFinite(sum) ? sum : 0;
        }
      }
    },
    rejectPendingChanges: (state, action) => {
      const { id, message, date = new Date().toISOString().slice(0,10) } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (p && p.pendingChanges) {
        if (message) {
          p.adminFeedback = p.adminFeedback || [];
          p.adminFeedback.push({ id: Date.now(), message, date });
        }
        delete p.pendingChanges;
        p.status = 'modification';
      }
    },
    addAdminFeedback: (state, action) => {
      const { id, message, date = new Date().toISOString().slice(0,10) } = action.payload;
      const p = state.products.find(pr => pr.id === id);
      if (p) {
        p.adminFeedback = p.adminFeedback || [];
        p.adminFeedback.push({ id: Date.now(), message, date });
        // Move to modification state to indicate action required
        if (p.status !== 'approved') p.status = 'modification';
      }
    },
    setProductFilter: (state, action) => {
      state.filter = action.payload;
    },
    setViewingProduct: (state, action) => {
      state.viewingProduct = action.payload;
    },
  },
});

export const { addProduct, addReviewResponse, resolveReport, updateStock, updateVariantStock, requestEdit, cancelPendingEdit, approvePendingChanges, rejectPendingChanges, addAdminFeedback, setProductFilter, setViewingProduct } = productSlice.actions;

export default productSlice.reducer;
