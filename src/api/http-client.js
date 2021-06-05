import axios from 'axios';
// import { configure } from 'axios-hooks';

let baseURL = 'http://localhost:5000/api/';

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://calm-dusk-82304.herokuapp.com/api/';
}

export const http = axios.create({
    baseURL,
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
