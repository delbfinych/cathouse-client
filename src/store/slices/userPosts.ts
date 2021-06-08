import { IPaginationResponse, userApi } from '../../api/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import { IPost, postApi } from '../../api/post';

const initialState = {
    posts: [] as IPost[],
    total_count: 0,
    total_pages: 1,
    failure: false,
    loading: false,
};
export const userPostSlice = createSlice({
    name: 'userPosts',
    initialState,
    reducers: {
        setPosts: (
            state,
            action: PayloadAction<IPaginationResponse<IPost>>
        ) => {
            state.posts.push(...action.payload.result);
            state.total_count = action.payload.total_count;
            state.total_pages = action.payload.total_pages;
        },
        setFailure: (state, action) => {
            state.failure = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        reset: (state) => {
            state.posts = [];
            state.total_count = 0;
            state.total_pages = 1;
        },
        appendPost: (state, action: PayloadAction<IPost>) => {
            state.posts.unshift(action.payload);
        },
        deletePost: (state, action: PayloadAction<number>) => {
            state.posts = state.posts.filter(
                (post) => post.post_id !== action.payload
            );
        },
        update: (state, action: PayloadAction<IPost>) => {
            const post = action.payload;
            const i = state.posts.findIndex((p) => p.post_id === post.post_id);
            state.posts[i] = post;
        },
    },
});

const { setPosts, setFailure, setLoading, appendPost, deletePost, update } =
    userPostSlice.actions;
export const loadUserWall =
    (id: number, page: number): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await userApi.getPosts(id, page);
            dispatch(setPosts(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };
export const loadFollowingWall =
    (id: number, page: number): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await userApi.getFolliwingPosts(id, page);
            dispatch(setPosts(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };
export const addPost =
    (text: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await postApi.create({ message: text });
            dispatch(appendPost(res.data));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const removePost =
    (id: number): AppThunk =>
    async (dispatch) => {
        try {
            await postApi.deleteById(id);
            dispatch(deletePost(id));
            dispatch(setFailure(false));
        } catch (err) {
            dispatch(setFailure(true));
        } finally {
        }
    };

export const updatePost =
    (id: number): AppThunk =>
    async (dispatch) => {
        try {
            const res = await postApi.getById(id);
            dispatch(update(res.data));
        } catch (error) {
            throw error;
        }
    };
export const { reset } = userPostSlice.actions;


export default userPostSlice.reducer;
