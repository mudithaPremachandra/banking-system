import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// --- Token management (persisted in localStorage) ---

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('accessToken', token);
    } else {
        localStorage.removeItem('accessToken');
    }
};

export const getAuthToken = (): string | null => localStorage.getItem('accessToken');

export const setRefreshToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('refreshToken', token);
    } else {
        localStorage.removeItem('refreshToken');
    }
};

export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loginTime');
};

// --- Request interceptor: attach access token ---

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response interceptor: refresh on 401 ---

let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refresh = getRefreshToken();
            if (!refresh) {
                clearTokens();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh });
                const newAccess = data.data?.accessToken || data.accessToken;
                const newRefresh = data.data?.refreshToken || data.refreshToken;
                setAuthToken(newAccess);
                setRefreshToken(newRefresh);
                processQueue(null, newAccess);
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearTokens();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
