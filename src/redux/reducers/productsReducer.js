import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE } from '../../constants/actionTypes';

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
        default:
            return state;
    }
};

export default productsReducer;
