import { FETCH_SELLERS_REQUEST, FETCH_SELLERS_SUCCESS, FETCH_SELLERS_FAILURE, APPROVE_SELLER, REJECT_SELLER } from '../../constants/actionTypes';
import apiClient from '../../api/api';

// This is a comment to explain the purpose of this file.
// This file contains the action creators for the sellers.

export const fetchSellersRequest = () => {
    return {
        type: FETCH_SELLERS_REQUEST
    };
};

export const fetchSellersSuccess = (sellers) => {
    return {
        type: FETCH_SELLERS_SUCCESS,
        payload: sellers
    };
};

export const fetchSellersFailure = (error) => {
    return {
        type: FETCH_SELLERS_FAILURE,
        payload: error
    };
};

// This is a comment to explain the purpose of this function.
// This is a thunk action creator that fetches the sellers from the mock data.
// In a real application, this would fetch the data from a backend API.
export const fetchSellers = () => {
    return async (dispatch) => {
        dispatch(fetchSellersRequest());
        try {
            const { data } = await apiClient.get('/users/sellers/');
            const sellers = (data?.sellers || []).map(s => ({
                id: s.id,
                name: s.name,
                email: s.email,
                status: s.status,
                dateApplied: s.dateApplied,
                shopName: s.shopName || '',
                shopsCount: s.shopsCount || 0,
                shops: Array.isArray(s.shops) ? s.shops : new Array(s.shopsCount || 0).fill(0).map((_,i)=>({ id: `${s.id}-shop${i+1}` , name: `Shop ${i+1}`, products: [], performance: '--'})),
            }));
            dispatch(fetchSellersSuccess(sellers));
        } catch (err) {
            dispatch(fetchSellersFailure(err.message || 'Failed to fetch sellers'));
        }
    };
};

export const approveSeller = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/users/sellers/${id}/approve/`);
        dispatch({ type: APPROVE_SELLER, payload: id });
    };
};

export const rejectSeller = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/users/sellers/${id}/reject/`);
        dispatch({ type: REJECT_SELLER, payload: id });
    };
};
