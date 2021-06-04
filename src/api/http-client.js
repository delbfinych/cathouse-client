import axios from 'axios';
// import { configure } from 'axios-hooks';

export const http = axios.create({
    baseURL: '/api/',
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

