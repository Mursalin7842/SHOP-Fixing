import { FETCH_PAYMENTS_REQUEST, FETCH_PAYMENTS_SUCCESS, FETCH_PAYMENTS_FAILURE } from '../../constants/actionTypes';

const initialState = {
    loading: false,
    transactions: [
        { id: 'TRN-001', orderId: 'ORD-101', customer: 'Alice', seller: 'JD Electronics', total: 199.99, date: '2025-09-05', method: 'Stripe', status: 'Completed' },
        { id: 'TRN-002', orderId: 'ORD-102', customer: 'Bob', seller: "Smith's Wares", total: 120.0, date: '2025-09-05', method: 'PayPal', status: 'Completed' },
    ],
    payouts: [
        { id: 'PAY-001', seller: 'JD Electronics', amount: 1250.75, requestedDate: '2025-09-04', status: 'Pending', transactions: [{ id: 'TRN-001', orderId: 'ORD-101', amount: 159.99 }] },
        { id: 'PAY-002', seller: "Smith's Wares", amount: 875.0, requestedDate: '2025-09-03', status: 'Pending', transactions: [{ id: 'TRN-002', orderId: 'ORD-102', amount: 96.0 }] },
    ],
    error: '',
};

const paymentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PAYMENTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_PAYMENTS_SUCCESS:
            return { loading: false, transactions: action.payload.transactions || [], payouts: action.payload.payouts || [], error: '' };
        case FETCH_PAYMENTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default paymentsReducer;
