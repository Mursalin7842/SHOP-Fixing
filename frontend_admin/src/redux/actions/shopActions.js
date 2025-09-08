import { FETCH_SHOPS_REQUEST, FETCH_SHOPS_SUCCESS, FETCH_SHOPS_FAILURE, APPROVE_SHOP, REJECT_SHOP, REQUEST_SHOP_MODIFICATION } from '../../constants/actionTypes';
import apiClient from '../../api/api';

export const fetchShopsRequest = () => ({ type: FETCH_SHOPS_REQUEST });
export const fetchShopsSuccess = (groups) => ({ type: FETCH_SHOPS_SUCCESS, payload: groups });
export const fetchShopsFailure = (error) => ({ type: FETCH_SHOPS_FAILURE, payload: error });

export const fetchShops = () => {
    return async (dispatch) => {
        dispatch(fetchShopsRequest());
        try {
            let { data } = await apiClient.get('/shop/');
            const normalizeShop = (s) => ({
                id: s.id,
                shopName: s.name,
                sellerName: s.owner ? `User #${s.owner}` : (s.sellerName || ''),
                category: s.category || 'General',
                dateApplied: s.created_at ? new Date(s.created_at).toISOString().slice(0,10) : (s.dateApplied || ''),
                statusDate: s.updated_at ? new Date(s.updated_at).toISOString().slice(0,10) : (s.statusDate || ''),
                description: s.description || '',
                history: Array.isArray(s.history) ? s.history : [],
            });
            const groups = Object.fromEntries(Object.entries(data || {}).map(([k, arr]) => [k, (arr || []).map(normalizeShop)]));
            dispatch(fetchShopsSuccess(groups));
        } catch (err) {
            // If unauthorized, try public read-only list
            if (err?.response?.status === 401) {
                try {
                    const { data: publicDataRaw } = await apiClient.get('/shop/public/');
                    // Public endpoint currently returns { shops: [...] }
                    const publicArray = Array.isArray(publicDataRaw)
                        ? publicDataRaw
                        : (Array.isArray(publicDataRaw?.shops) ? publicDataRaw.shops : []);
                    const normalizeShop = (s) => ({
                        id: s.id,
                        shopName: s.name,
                        sellerName: s.owner ? `User #${s.owner}` : (s.sellerName || ''),
                        category: s.category || 'General',
                        dateApplied: s.created_at ? new Date(s.created_at).toISOString().slice(0,10) : (s.dateApplied || ''),
                        statusDate: s.updated_at ? new Date(s.updated_at).toISOString().slice(0,10) : (s.statusDate || ''),
                        description: s.description || '',
                        history: [],
                    });
                    const groups = { approved: publicArray.map(normalizeShop), pending: [], rejected: [], modification: [] };
                    dispatch(fetchShopsSuccess(groups));
                    return;
                } catch (e2) {
                    dispatch(fetchShopsFailure(e2.message || 'Failed to fetch shops (public fallback)'));
                    return;
                }
            }
            dispatch(fetchShopsFailure(err.message || 'Failed to fetch shops'));
        }
    };
};

export const approveShop = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/shop/${id}/approve/`);
        dispatch({ type: APPROVE_SHOP, payload: id });
    };
};

export const rejectShop = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/shop/${id}/reject/`);
        dispatch({ type: REJECT_SHOP, payload: id });
    };
};

// Local-only for now
export const requestShopModification = (id, note) => ({
    type: REQUEST_SHOP_MODIFICATION,
    payload: { id, note },
});
