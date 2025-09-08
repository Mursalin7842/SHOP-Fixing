import axios from 'axios';

// Basic Axios client for seller app
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Token storage keys
const ACCESS_KEY = 'seller_access_token';
const REFRESH_KEY = 'seller_refresh_token';

export const getAccessToken = () => {
  try { return localStorage.getItem(ACCESS_KEY) || null; } catch { return null; }
};

export const setAuthTokens = ({ access, refresh }) => {
  try {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  } catch { /* ignore storage errors */ }
};

export const clearAuthTokens = () => {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch { /* ignore storage errors */ }
};

// Attach Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Attempt token refresh on 401 once
let isRefreshing = false;
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      const refresh = (() => { try { return localStorage.getItem(REFRESH_KEY); } catch { return null; } })();
      if (refresh && !isRefreshing) {
        original._retry = true;
        isRefreshing = true;
        try {
          const { data } = await apiClient.post('/auth/token/refresh/', { refresh });
          setAuthTokens({ access: data.access });
          isRefreshing = false;
          // retry original
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(original);
        } catch {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Payouts API helpers for seller app
export const sellerPayoutsApi = {
  list: () => apiClient.get('/payments/payouts/mine/').then(r => r.data),
  create: (data) => apiClient.post('/payments/payouts/create/', data).then(r => r.data),
  cancel: (id) => apiClient.post(`/payments/payouts/mine/${id}/cancel/`).then(r => r.data),
  confirm: (id) => apiClient.post(`/payments/payouts/mine/${id}/confirm/`).then(r => r.data),
};

// Shop documents API
export const shopFilesApi = {
  uploadDocument: (shopId, { file, doc_type, number }) => {
    const fd = new FormData();
    fd.append('file', file);
    if (doc_type) fd.append('doc_type', doc_type);
    if (number) fd.append('number', number);
    return apiClient.post(`/shop/${shopId}/upload-document/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  uploadAttachment: (shopId, { file, name }) => {
    const fd = new FormData();
    fd.append('file', file);
    if (name) fd.append('name', name);
    return apiClient.post(`/shop/${shopId}/upload-attachment/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  myShopDetail: (shopId) => apiClient.get(`/shop/mine/${shopId}/`).then(r => r.data),
};
