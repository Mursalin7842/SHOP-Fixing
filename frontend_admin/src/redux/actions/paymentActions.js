import { FETCH_PAYMENTS_REQUEST, FETCH_PAYMENTS_SUCCESS, FETCH_PAYMENTS_FAILURE } from '../../constants/actionTypes';
import apiClient from '../../api/api';

export const fetchPaymentsRequest = () => ({ type: FETCH_PAYMENTS_REQUEST });
export const fetchPaymentsSuccess = (data) => ({ type: FETCH_PAYMENTS_SUCCESS, payload: data });
export const fetchPaymentsFailure = (error) => ({ type: FETCH_PAYMENTS_FAILURE, payload: error });

export const fetchPayments = () => {
    return async (dispatch) => {
        dispatch(fetchPaymentsRequest());
        try {
            const [paymentsRes, payoutsRes] = await Promise.all([
                apiClient.get('/payments/'),
                apiClient.get('/payments/payouts/'),
            ]);
            const payments = paymentsRes.data?.payments || [];
            const payouts = payoutsRes.data?.payouts || [];
            dispatch(fetchPaymentsSuccess({ transactions: payments, payouts }));
        } catch (err) {
            dispatch(fetchPaymentsFailure(err.message || 'Failed to fetch payments'));
        }
    };
};

export const approvePayout = (id) => async (dispatch) => {
    try {
        await apiClient.post(`/payments/payouts/${id}/approve/`);
        dispatch(fetchPayments());
    } catch {
        // noop; could add toast
    }
};

export const rejectPayout = (id) => async (dispatch) => {
    try {
        await apiClient.post(`/payments/payouts/${id}/reject/`);
        dispatch(fetchPayments());
    } catch {
        // noop; could add toast
    }
};
