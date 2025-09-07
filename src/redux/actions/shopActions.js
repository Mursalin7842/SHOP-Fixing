import { FETCH_SHOPS_REQUEST, FETCH_SHOPS_SUCCESS, FETCH_SHOPS_FAILURE } from '../../constants/actionTypes';
// import apiClient from '../../api/api';

export const fetchShopsRequest = () => ({ type: FETCH_SHOPS_REQUEST });
export const fetchShopsSuccess = (groups) => ({ type: FETCH_SHOPS_SUCCESS, payload: groups });
export const fetchShopsFailure = (error) => ({ type: FETCH_SHOPS_FAILURE, payload: error });

export const fetchShops = () => {
    return async (dispatch, getState) => {
        dispatch(fetchShopsRequest());
        try {
            // const { data } = await apiClient.get('/shops');
            // dispatch(fetchShopsSuccess(data));
            const groups = getState().shops.items;
            dispatch(fetchShopsSuccess(groups));
        } catch (err) {
            dispatch(fetchShopsFailure(err.message || 'Failed to fetch shops'));
        }
    };
};
