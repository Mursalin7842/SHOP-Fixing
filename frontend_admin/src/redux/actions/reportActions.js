import { FETCH_REPORTS_REQUEST, FETCH_REPORTS_SUCCESS, FETCH_REPORTS_FAILURE } from '../../constants/actionTypes';
import apiClient from '../../api/api';

export const fetchReportsRequest = () => ({ type: FETCH_REPORTS_REQUEST });
export const fetchReportsSuccess = (groups) => ({ type: FETCH_REPORTS_SUCCESS, payload: groups });
export const fetchReportsFailure = (error) => ({ type: FETCH_REPORTS_FAILURE, payload: error });

export const fetchReports = () => {
    return async (dispatch) => {
        dispatch(fetchReportsRequest());
        try {
            const { data } = await apiClient.get('/reports/');
            // Backend returns { reports: [...] }; keep UI shape by grouping or pass-through
            dispatch(fetchReportsSuccess(data));
        } catch (err) {
            dispatch(fetchReportsFailure(err.message || 'Failed to fetch reports'));
        }
    };
};
