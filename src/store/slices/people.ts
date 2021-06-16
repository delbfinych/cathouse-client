import { IUserWithFollowInfo, IPaginationResponse } from './../../api/user';
import { userApi } from '../../api/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';

export const peopleSlice = createSlice({
    name: 'people',
    initialState: {
        following: { data: [] as IUserWithFollowInfo[], total_count: 0 },
        followers: { data: [] as IUserWithFollowInfo[], total_count: 0 },
        failure: false,
        loading: false,
    },
    reducers: {
        follow: (state, action: PayloadAction<IUserWithFollowInfo>) => {
            state.following.data.push(action.payload);
            state.following.total_count++;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        loadFollowing: (
            state,
            action: PayloadAction<IPaginationResponse<IUserWithFollowInfo>>
        ) => {
            state.following.data = action.payload.result;
            state.following.total_count = action.payload.total_count;
        },
        loadFollowers: (
            state,
            action: PayloadAction<IPaginationResponse<IUserWithFollowInfo>>
        ) => {
            state.followers.data = action.payload.result;
            state.followers.total_count = action.payload.total_count;
        },
        unfollow: (state, action: PayloadAction<number>) => {
            state.following.data = state.following.data.filter(
                (user) => user.id !== action.payload
            );
            state.following.total_count--;
        },
        setFailure: (state, action) => {
            state.failure = action.payload;
        },
    },
});

const {
    follow,
    setLoading,
    loadFollowers,
    unfollow,
    setFailure,
    loadFollowing,
} = peopleSlice.actions;
export const getFollowing =
    (id: number, page: number): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await userApi.getFollowing(id, page);
            dispatch(loadFollowing(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const getFollowers =
    (id: number, page: number): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await userApi.getFollowers(id, page);
            dispatch(loadFollowers(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const followUser =
    (user: IUserWithFollowInfo): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            await userApi.follow(user.id);
            dispatch(follow(user));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const unfollowUser =
    (user: IUserWithFollowInfo): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            await userApi.unfollow(user.id);
            dispatch(unfollow(user.id));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };
export default peopleSlice.reducer;
