import { IUser } from './../../../cathouse-server/controllers/interfaces';
import { http } from './http-client';

interface IToken {
    token: string;
}
const signIn = (data: object) =>
    http.post<IToken>('auth/signin', {
        ...data,
    });

const signUp = (data: FormData) =>
    http.post<IToken>('/auth/signup', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

const verifyUsername = (username: string) =>
    http.get(`/auth/verifyUserName?username=${username}`);

const verifyToken = () => http.get<IUser>(`/auth/verifyToken`);

export const authApi = { signIn, signUp, verifyUsername, verifyToken };
