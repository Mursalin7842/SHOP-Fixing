import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE } from '../../constants/actionTypes';
// import apiClient from '../../api/api';

export const fetchProductsRequest = () => ({ type: FETCH_PRODUCTS_REQUEST });
export const fetchProductsSuccess = (groups) => ({ type: FETCH_PRODUCTS_SUCCESS, payload: groups });
export const fetchProductsFailure = (error) => ({ type: FETCH_PRODUCTS_FAILURE, payload: error });

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        dispatch(fetchProductsRequest());
        try {
            // const { data } = await apiClient.get('/products');
            // dispatch(fetchProductsSuccess(data));
            // For now, use whatever is in initial state as a stand-in
            const groups = getState().products.items;
            dispatch(fetchProductsSuccess(groups));
        } catch (err) {
            dispatch(fetchProductsFailure(err.message || 'Failed to fetch products'));
        }
    };
};
