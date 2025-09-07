import { FETCH_PAYMENTS_REQUEST, FETCH_PAYMENTS_SUCCESS, FETCH_PAYMENTS_FAILURE } from '../../constants/actionTypes';
// import apiClient from '../../api/api';

export const fetchPaymentsRequest = () => ({ type: FETCH_PAYMENTS_REQUEST });
export const fetchPaymentsSuccess = (data) => ({ type: FETCH_PAYMENTS_SUCCESS, payload: data });
export const fetchPaymentsFailure = (error) => ({ type: FETCH_PAYMENTS_FAILURE, payload: error });

export const fetchPayments = () => {
    return async (dispatch, getState) => {
        dispatch(fetchPaymentsRequest());
        try {
            // const { data } = await apiClient.get('/payments/dashboard');
            // dispatch(fetchPaymentsSuccess(data));
            const state = getState().payments;
            dispatch(fetchPaymentsSuccess({ transactions: state.transactions, payouts: state.payouts }));
        } catch (err) {
            dispatch(fetchPaymentsFailure(err.message || 'Failed to fetch payments'));
        }
    };
};
