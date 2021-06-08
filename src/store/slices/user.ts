import { IUser, userApi, IUpdateUserData } from './../../api/user';
import { authApi } from './../../api/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null as IUser | null,
        failure: false,
        loading: false,
    },
    reducers: {
        setUserData: (state, action: PayloadAction<IUser>) => {
            state.user = { ...state.user, ...action.payload };
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
        const res = await authApi.verifyToken();
        dispatch(setUserData(res.data));
        dispatch(setFailure(false));
    } catch (err) {
        dispatch(setFailure(true));
    } finally {
        dispatch(setLoading(false));
    }
};
export const update =
    (id: number, data: IUpdateUserData): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            await userApi.update(id, data);
            const res = await userApi.getById(id);
            dispatch(setUserData(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };
export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
