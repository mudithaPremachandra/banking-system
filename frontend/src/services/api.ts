import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

api.interceptors.request.use(
    (config) => {
        if (authToken && config.headers) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setAuthToken(null);
            // Let AuthContext handle the redirect by triggering a state change
        }
        return Promise.reject(error);
    }
);

export default api;
//this section was implemented by kawindimuhandiram.initially commited through kavindya's account due to an issue with my device.//