import { FETCH_SHOPS_REQUEST, FETCH_SHOPS_SUCCESS, FETCH_SHOPS_FAILURE } from '../../constants/actionTypes';

const initialState = {
    loading: false,
    items: {
        pending: [
            { id: 'SHP-a1b2', shopName: 'Quantum Gaming Gear', sellerName: 'John Doe', category: 'Electronics', dateApplied: '2025-09-05', description: 'A new shop focusing on high-end gaming peripherals.', history: [{ action: 'Submitted', admin: 'System', date: 'Sep 5, 2025 - 12:01 PM' }] },
            { id: 'SHP-c3d4', shopName: 'Vintage Wears', sellerName: 'Jane Smith', category: 'Apparel', dateApplied: '2025-09-05', description: 'A second-hand clothing store with unique finds.', history: [{ action: 'Submitted', admin: 'System', date: 'Sep 5, 2025 - 02:30 PM' }] },
        ],
        approved: [
            { id: 'SHP-e5f6', shopName: 'Green Thumb Gardens', sellerName: 'Samuel Green', category: 'Home & Garden', dateApplied: '2025-09-04', statusDate: '2025-09-05', description: 'Organic gardening supplies.', history: [] },
        ],
        rejected: [
            { id: 'SHP-g7h8', shopName: 'Gadget Gurus', sellerName: 'Mike Ross', category: 'Electronics', dateApplied: '2025-09-03', statusDate: '2025-09-04', description: 'Refurbished electronics.', history: [] },
        ],
        modification: [
            { id: 'SHP-i9j0', shopName: 'The White Collection', sellerName: 'Emily White', category: 'Home Goods', dateApplied: '2025-09-02', statusDate: '2025-09-03', resubmitted: false, description: 'Minimalist home decor.', history: [] },
        ],
    },
    error: '',
};

const shopsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SHOPS_REQUEST:
            return { ...state, loading: true };
        case FETCH_SHOPS_SUCCESS:
            return { loading: false, items: action.payload, error: '' };
        case FETCH_SHOPS_FAILURE:
            return { loading: false, items: initialState.items, error: action.payload };
        default:
            return state;
    }
};

export default shopsReducer;
