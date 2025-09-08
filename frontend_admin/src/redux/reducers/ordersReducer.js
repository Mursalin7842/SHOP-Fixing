import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE, UPDATE_ORDER_STATUS } from '../../constants/actionTypes';

const initialState = {
  loading: false,
  items: [
    { id: 'ORD-1001', shop: 'JD Electronics', customer: 'Alice', total: 299.99, status: 'processing', date: '2025-09-05' },
    { id: 'ORD-1002', shop: 'JD Electronics', customer: 'Bob', total: 89.49, status: 'shipped', date: '2025-09-05' },
    { id: 'ORD-1003', shop: "Smith's Wares", customer: 'Cara', total: 54.00, status: 'pending', date: '2025-09-04' },
  ],
  error: '',
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_ORDERS_SUCCESS:
      return { loading: false, items: action.payload, error: '' };
    case FETCH_ORDERS_FAILURE:
      return { loading: false, items: initialState.items, error: action.payload };
    case UPDATE_ORDER_STATUS: {
      const { id, status } = action.payload || {};
      return { ...state, items: state.items.map(o => o.id === id ? { ...o, status } : o) };
    }
    default:
      return state;
  }
}
