import axios from 'axios';
import { authApi } from './auth';
// import { configure } from 'axios-hooks';

let baseURL = 'http://localhost:5000/api/';

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://calm-dusk-82304.herokuapp.com/api/';
}

export const http = axios.create({
    baseURL,
    withCredentials: true,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
});

http.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await (await authApi.refreshToken()).data.token;
            localStorage.setItem('access_token', accessToken);
            return http(originalRequest);
        }
        return Promise.reject(error);
    }
);
