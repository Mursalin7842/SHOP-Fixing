import { FETCH_SELLERS_REQUEST, FETCH_SELLERS_SUCCESS, FETCH_SELLERS_FAILURE } from '../../constants/actionTypes';
import apiClient from '../../api/api';
import { MOCK_DATA } from '../../api/mockData';

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
    return (dispatch) => {
        dispatch(fetchSellersRequest());
        // In a real application, you would use the apiClient to make the API call like this:
        // apiClient.get('/sellers')
        //     .then(response => {
        //         const sellers = response.data;
        //         dispatch(fetchSellersSuccess(sellers));
        //     })
        //     .catch(error => {
        //         const errorMessage = error.message;
        //         dispatch(fetchSellersFailure(errorMessage));
        //     });

        // For now, we are using mock data.
        dispatch(fetchSellersSuccess(MOCK_DATA.sellers));
    };
};
