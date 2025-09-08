import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, APPROVE_PRODUCT, REJECT_PRODUCT, REQUEST_PRODUCT_MODIFICATION, APPROVE_PRODUCT_VARIANTS } from '../../constants/actionTypes';
import apiClient from '../../api/api';

export const fetchProductsRequest = () => ({ type: FETCH_PRODUCTS_REQUEST });
export const fetchProductsSuccess = (groups) => ({ type: FETCH_PRODUCTS_SUCCESS, payload: groups });
export const fetchProductsFailure = (error) => ({ type: FETCH_PRODUCTS_FAILURE, payload: error });

export const fetchProducts = () => {
    return async (dispatch) => {
        dispatch(fetchProductsRequest());
        try {
            let { data } = await apiClient.get('/products/');
            // Normalize backend payload to UI-friendly shape
            const normalizeProduct = (p) => ({
                id: p.id,
                name: p.name,
                seller: p.shop ? `Shop #${p.shop}` : (p.seller || ''),
                price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
                category: p.category || 'General',
                stock: p.stock ?? 0,
                description: p.description || '',
                date: p.created_at ? new Date(p.created_at).toISOString().slice(0,10) : (p.date || ''),
                history: Array.isArray(p.history) ? p.history : [],
                variants: Array.isArray(p.variants) ? p.variants : [],
                pendingChanges: p.pendingChanges || undefined,
            });
            const groups = Object.fromEntries(Object.entries(data || {}).map(([k, arr]) => [k, (arr || []).map(normalizeProduct)]));
            dispatch(fetchProductsSuccess(groups));
        } catch (err) {
            if (err?.response?.status === 401) {
                try {
                    const { data: publicDataRaw } = await apiClient.get('/products/public/');
                    // Public endpoint returns only approved products; may be array or { approved: [...] }
                    const publicArray = Array.isArray(publicDataRaw)
                        ? publicDataRaw
                        : (Array.isArray(publicDataRaw?.approved) ? publicDataRaw.approved : []);
                    const normalizeProduct = (p) => ({
                        id: p.id,
                        name: p.name,
                        seller: p.shop ? `Shop #${p.shop}` : (p.seller || ''),
                        price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
                        category: p.category || 'General',
                        stock: p.stock ?? 0,
                        description: p.description || '',
                        date: p.created_at ? new Date(p.created_at).toISOString().slice(0,10) : (p.date || ''),
                        history: [],
                        variants: [],
                        pendingChanges: undefined,
                    });
                    const groups = { approved: publicArray.map(normalizeProduct), pending: [], rejected: [], modification: [] };
                    dispatch(fetchProductsSuccess(groups));
                    return;
                } catch (e2) {
                    dispatch(fetchProductsFailure(e2.message || 'Failed to fetch products (public fallback)'));
                    return;
                }
            }
            dispatch(fetchProductsFailure(err.message || 'Failed to fetch products'));
        }
    };
};

// Approve a product on the server, then reflect in local state
export const approveProduct = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/products/${id}/approve/`);
        dispatch({ type: APPROVE_PRODUCT, payload: id });
        // Optionally refresh groups from server
        // dispatch(fetchProducts());
    };
};

// Reject a product on the server, then reflect in local state
export const rejectProduct = (id) => {
    return async (dispatch) => {
        await apiClient.post(`/products/${id}/reject/`);
        dispatch({ type: REJECT_PRODUCT, payload: id });
        // Optionally refresh groups from server
        // dispatch(fetchProducts());
    };
};

// Local-only for now (no server endpoint implemented)
export const requestProductModification = (id, note) => ({
    type: REQUEST_PRODUCT_MODIFICATION,
    payload: { id, note },
});

// Local-only for now (no server endpoint implemented for variant approvals)
export const approveProductVariants = (id, variantKeys) => ({
    type: APPROVE_PRODUCT_VARIANTS,
    payload: { id, variantKeys },
});
