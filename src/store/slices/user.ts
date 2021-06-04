import jwt_decode from 'jwt-decode';
import { authApi } from './../../api/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';

export enum Roles {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
}

export interface UserData {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: Roles;
    avatar_url: string;
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null as UserData | null,
        failure: false,
        loading: false,
    },
    reducers: {
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
        },
        setFailure: (state, action) => {
            state.failure = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

const { setFailure, setLoading } = userSlice.actions;
export const verifyUser = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await authApi.verifyToken();

        const token = localStorage.getItem('access_token')!;
        const decoded: UserData = jwt_decode(token);
        dispatch(setUserData(decoded));
        dispatch(setFailure(false));
    } catch (err) {
        dispatch(setFailure(true));
    } finally {
        dispatch(setLoading(false));
    }
};

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
