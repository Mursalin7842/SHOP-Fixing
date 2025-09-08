import { FETCH_TICKETS_REQUEST, FETCH_TICKETS_SUCCESS, FETCH_TICKETS_FAILURE, ADD_TICKET_MESSAGE, UPDATE_TICKET_STATUS } from '../../constants/actionTypes';

const initialState = {
  loading: false,
  tickets: [
    { id: 'TCK-001', shop: 'JD Electronics', subject: 'Shipping delay inquiry', status: 'open', messages: [{ from: 'seller', text: 'Customer reports delay.', date: '2025-09-05' }] },
    { id: 'TCK-002', shop: "Smith's Wares", subject: 'Refund policy clarification', status: 'open', messages: [] },
  ],
  error: '',
};

export default function supportReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TICKETS_REQUEST:
      return { ...state, loading: true };
    case FETCH_TICKETS_SUCCESS:
      return { loading: false, tickets: action.payload, error: '' };
    case FETCH_TICKETS_FAILURE:
      return { loading: false, tickets: initialState.tickets, error: action.payload };
    case ADD_TICKET_MESSAGE: {
      const { id, message } = action.payload || {};
      return {
        ...state,
        tickets: state.tickets.map(t => t.id === id ? { ...t, messages: [...t.messages, message] } : t),
      };
    }
    case UPDATE_TICKET_STATUS: {
      const { id, status } = action.payload || {};
      return { ...state, tickets: state.tickets.map(t => t.id === id ? { ...t, status } : t) };
    }
    default:
      return state;
  }
}
