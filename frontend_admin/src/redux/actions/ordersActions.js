import { FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE, UPDATE_ORDER_STATUS } from '../../constants/actionTypes';
import apiClient from '../../api/api';

export const fetchOrdersRequest = () => ({ type: FETCH_ORDERS_REQUEST });
export const fetchOrdersSuccess = (items) => ({ type: FETCH_ORDERS_SUCCESS, payload: items });
export const fetchOrdersFailure = (error) => ({ type: FETCH_ORDERS_FAILURE, payload: error });

export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch(fetchOrdersRequest());
    try {
      const { data } = await apiClient.get('/orders/');
      dispatch(fetchOrdersSuccess(data?.orders || []));
    } catch (err) {
      dispatch(fetchOrdersFailure(err.message || 'Failed to fetch orders'));
    }
  };
};

export const updateOrderStatus = (id, status) => ({ type: UPDATE_ORDER_STATUS, payload: { id, status } });
