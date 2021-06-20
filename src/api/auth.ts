import { postApi } from './post';
import { http } from './http-client';
interface IToken {
    token: string;
}
const signIn = (data: object) =>
    http.post<IToken>('auth/signin', {
        ...data,
    });

    //s
const signUp = (data: object) => http.post<IToken>('/auth/signup', { ...data });

const signOut = () => http.get('/auth/signout');
const verifyUsername = (username: string) =>
    http.get(`/auth/verifyUserName?username=${username}`);

const refreshToken = () => http.get('/auth/refreshToken');
export const authApi = {
    signIn,
    signUp,
    verifyUsername,
    refreshToken,
    signOut,
};
