import { http } from './http-client';
import { IUser } from './user';

interface IToken {
    token: string;
}
const signIn = (data: object) =>
    http.post<IToken>('auth/signin', {
        ...data,
    });

const signUp = (data: object) => http.post<IToken>('/auth/signup', { ...data });

const verifyUsername = (username: string) =>
    http.get(`/auth/verifyUserName?username=${username}`);

const verifyToken = () => http.get<IUser>(`/auth/verifyToken`);

const refreshToken = () => http.get('/auth/refreshToken');
export const authApi = {
    signIn,
    signUp,
    verifyUsername,
    verifyToken,
    refreshToken,
};
