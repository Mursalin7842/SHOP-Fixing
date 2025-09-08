import axios from 'axios';

// This is a comment to explain the purpose of this file.
// This file creates an instance of axios with a base URL for the backend API.
// In a real application, the baseURL would be the URL of the Django backend.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // This should be replaced with the actual backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Basic token storage for admin (optional)
const ACCESS_KEY = 'admin_access_token';
const REFRESH_KEY = 'admin_refresh_token';
export const setAdminTokens = ({ access, refresh }) => {
    try { if (access) localStorage.setItem(ACCESS_KEY, access); if (refresh) localStorage.setItem(REFRESH_KEY, refresh); } catch { /* ignore */ }
};
const getAccess = () => { try { return localStorage.getItem(ACCESS_KEY); } catch { return null; } };
const getRefresh = () => { try { return localStorage.getItem(REFRESH_KEY); } catch { return null; } };

apiClient.interceptors.request.use((config) => {
    const token = getAccess();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;

// Basic 401 handling (silent future enhancement)
apiClient.interceptors.response.use(
    r => r,
    async (error) => {
        if (error?.response?.status === 401) {
            const refresh = getRefresh();
            if (refresh && !error.config.__retry) {
                try {
                    error.config.__retry = true;
                    const { data } = await axios.post('http://localhost:8000/api/auth/token/refresh/', { refresh });
                    if (data?.access) {
                        localStorage.setItem(ACCESS_KEY, data.access);
                        error.config.headers.Authorization = `Bearer ${data.access}`;
                        return apiClient.request(error.config);
                    }
                } catch {/* ignore refresh errors */}
            }
        }
        return Promise.reject(error);
    }
);
