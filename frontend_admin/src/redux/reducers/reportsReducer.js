import { FETCH_REPORTS_REQUEST, FETCH_REPORTS_SUCCESS, FETCH_REPORTS_FAILURE } from '../../constants/actionTypes';

const initialState = {
    loading: false,
    items: {
        new: [{ id: 'REP-001', userId: 'USR-xyz123', type: 'Bug Report', subject: 'Cannot update profile picture', date: '2025-09-05', status: 'New', description: 'When I try to upload a new profile picture, I get a 500 server error. I have tried multiple image formats.', sellerId: 'SEL-i9j0k112', shopId: 'SHP-c3d4', productId: 'PROD-002' }],
        progress: [{ id: 'REP-002', userId: 'USR-abc789', type: 'Seller Complaint', subject: 'Item not as described', date: '2025-09-04', status: 'In Progress', description: 'The "Cyber-Knit Jacket" I received is a different color than advertised.', sellerId: 'SEL-i9j0k112', shopId: 'SHP-c3d4', productId: 'PROD-003' }],
        resolved: [{ id: 'REP-003', userId: 'USR-def456', type: 'Feedback', subject: 'Love the new layout!', date: '2025-09-03', status: 'Resolved', description: 'Just wanted to say the new website design is fantastic. Much easier to navigate.', sellerId: null, shopId: null, productId: null }],
    },
    error: '',
};

const reportsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REPORTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_REPORTS_SUCCESS: {
            const p = action.payload || {};
            // If backend returned a flat list { reports: [...] }, wrap it into a simple grouping for UI
            const items = p.items || (p.reports ? { new: p.reports, progress: [], resolved: [] } : initialState.items);
            return { loading: false, items, error: '' };
        }
        case FETCH_REPORTS_FAILURE:
            return { loading: false, items: initialState.items, error: action.payload };
        default:
            return state;
    }
};

export default reportsReducer;
