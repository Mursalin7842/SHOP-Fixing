import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, APPROVE_PRODUCT, REJECT_PRODUCT, REQUEST_PRODUCT_MODIFICATION, APPROVE_PRODUCT_VARIANTS } from '../../constants/actionTypes';

const initialState = {
    loading: false,
    items: {
        pending: [
            { id: 'PROD-001', name: 'Quantum Headset', seller: 'JD Electronics', price: 199.99, category: 'Electronics', stock: 150, description: 'High-fidelity gaming headset with immersive 7.1 surround sound.', date: '2025-09-05', history: [{ action: 'Submitted', admin: 'System', date: 'Sep 5, 2025 - 12:05 PM' }] },
            { id: 'PROD-002', name: "Aether-Light Sneakers", seller: "Smith's Wares", price: 120.0, category: 'Apparel', stock: 200, description: 'Lightweight and durable sneakers for everyday use.', date: '2025-09-04', history: [] },
        ],
        approved: [
            { id: 'PROD-003', name: "Cyber-Knit Jacket", seller: "Smith's Wares", price: 350.0, category: 'Apparel', stock: 80, description: 'A stylish jacket with integrated smart fabric.', date: '2025-09-04', history: [] },
        ],
        rejected: [
            { id: 'PROD-004', name: 'Hover-Drone X1', seller: 'Ross Gadgets', price: 899.0, category: 'Gadgets', stock: 30, description: 'A professional-grade camera drone.', date: '2025-09-03', history: [] },
        ],
        flagged: [
            { id: 'PROD-003', name: "Cyber-Knit Jacket", seller: "Smith's Wares", price: 350.0, category: 'Apparel', stock: 80, description: 'A stylish jacket with integrated smart fabric.', date: '2025-09-05', reason: 'Potential counterfeit item reported by user.', history: [] },
        ],
        modification: [
            { id: 'PROD-005', name: 'Chrono-Watch', seller: 'Time Keepers Inc.', price: 425.0, category: 'Accessories', stock: 120, description: 'A sleek, modern watch.', date: '2025-09-01', resubmitted: false, history: [] },
        ],
    },
    error: '',
};

const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_PRODUCTS_SUCCESS:
            return { loading: false, items: action.payload, error: '' };
        case FETCH_PRODUCTS_FAILURE:
            return { loading: false, items: initialState.items, error: action.payload };
        case APPROVE_PRODUCT: {
            const id = action.payload;
            const fromGroups = ['pending','modification','rejected','flagged'];
            const existing = state.items.approved.find(p=>p.id===id);
            let moved = existing;
            if (!moved) {
                for (const g of fromGroups) {
                    moved = (state.items[g] || []).find(p=>p.id===id) || moved;
                }
            }
            const approved = moved ? [...state.items.approved, { ...moved, status: 'approved' }] : state.items.approved;
            return {
                ...state,
                items: {
                    ...state.items,
                    approved,
                    pending: state.items.pending.filter(p=>p.id!==id),
                    modification: state.items.modification.filter(p=>p.id!==id),
                    rejected: state.items.rejected.filter(p=>p.id!==id),
                    flagged: (state.items.flagged||[]).filter(p=>p.id!==id),
                }
            };
        }
        case REJECT_PRODUCT: {
            const id = action.payload;
            const prod = [...state.items.pending, ...state.items.flagged, ...state.items.modification].find(p => p.id === id);
            return { ...state, items: { ...state.items, rejected: prod ? [...state.items.rejected, { ...prod, status: 'rejected' }] : state.items.rejected, pending: state.items.pending.filter(p=>p.id!==id), flagged: state.items.flagged.filter(p=>p.id!==id), modification: state.items.modification.filter(p=>p.id!==id) } };
        }
        case REQUEST_PRODUCT_MODIFICATION: {
            const { id, note } = action.payload || {};
            const source = [...state.items.pending, ...state.items.approved, ...state.items.rejected, ...(state.items.flagged||[])];
            const prod = source.find(p=>p.id===id);
            const withHistory = prod ? { ...prod, status: 'modification', history: [...(prod.history||[]), { action:'Requested modification', admin:'Admin', date: new Date().toLocaleString(), details: note }] } : null;
            return {
                ...state,
                items: {
                    ...state.items,
                    modification: withHistory ? [...state.items.modification, withHistory] : state.items.modification,
                    pending: state.items.pending.filter(p=>p.id!==id),
                    approved: state.items.approved.filter(p=>p.id!==id),
                    rejected: state.items.rejected.filter(p=>p.id!==id),
                    flagged: (state.items.flagged||[]).filter(p=>p.id!==id),
                }
            };
        }
        case APPROVE_PRODUCT_VARIANTS: {
            const { id, variantKeys = [] } = action.payload || {};
            const apply = (group) => group.map(p => {
                if (p.id !== id) return p;
                const existing = p.variants || [];
                const pending = p.pendingChanges?.variants || [];
                const keyOf = (v) => JSON.stringify(Object.entries((v.attributes||{})).sort(([a],[b])=>a.localeCompare(b)));
                const approved = pending.filter(v => variantKeys.length === 0 || variantKeys.includes(keyOf(v))).map(v => ({ ...v, status: 'approved' }));
                const restPending = pending.filter(v => !approved.includes(v));
                const merged = [...existing, ...approved];
                const next = { ...p, variants: merged, status: 'approved', pendingChanges: restPending.length ? { ...p.pendingChanges, variants: restPending } : undefined };
                return next;
            });
            return { ...state, items: { ...state.items, approved: apply(state.items.approved), pending: apply(state.items.pending), modification: apply(state.items.modification) } };
        }
        default:
            return state;
    }
};

export default productsReducer;
