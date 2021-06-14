import axios from 'axios';
import store from '../store';
import { userActions } from '../store/slices/user';

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
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                const accessToken = await instanceForRefresh.get(
                    '/auth/refreshToken'
                );
                localStorage.setItem('access_token', accessToken.data.token);

                return http(originalRequest);
            } catch (e) {
                
                console.log("SADSAD");
            } 
        }console.log(error.status);
       
        if (error.response.status === 401) {
            store.dispatch(userActions.reset());
            store.dispatch(userActions.setFailure(true));
        }
        throw error;
    }
);

const instanceForRefresh = axios.create({
    baseURL,
    withCredentials: true,
});
