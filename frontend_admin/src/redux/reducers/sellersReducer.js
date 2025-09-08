import { FETCH_SELLERS_REQUEST, FETCH_SELLERS_SUCCESS, FETCH_SELLERS_FAILURE } from '../../constants/actionTypes';

// This is a comment to explain the purpose of this file.
// This file contains the reducer for the sellers.

const initialState = {
    loading: false,
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
            return {
                loading: false,
                sellers: action.payload,
                error: ''
            };
        case FETCH_SELLERS_FAILURE:
            return {
                loading: false,
                sellers: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default sellersReducer;
