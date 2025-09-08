import { FETCH_SELLERS_REQUEST, FETCH_SELLERS_SUCCESS, FETCH_SELLERS_FAILURE, APPROVE_SELLER, REJECT_SELLER } from '../../constants/actionTypes';

// This is a comment to explain the purpose of this file.
// This file contains the reducer for the sellers.

const initialState = {
    loading: false,
    // store as grouped lists for easier tab filtering
    sellers: [],
    error: ''
};

const sellersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SELLERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_SELLERS_SUCCESS:
            return { loading: false, sellers: action.payload, error: '' };
        case FETCH_SELLERS_FAILURE:
            return {
                loading: false,
                sellers: [],
                error: action.payload
            };
        case APPROVE_SELLER: {
            const id = action.payload;
            const updated = state.sellers.map(s => s.id === id ? { ...s, status: 'approved' } : s);
            return { ...state, sellers: updated };
        }
        case REJECT_SELLER: {
            const id = action.payload;
            const updated = state.sellers.map(s => s.id === id ? { ...s, status: 'rejected' } : s);
            return { ...state, sellers: updated };
        }
        default:
            return state;
    }
};

export default sellersReducer;
