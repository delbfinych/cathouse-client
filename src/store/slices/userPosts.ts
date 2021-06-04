import { userApi } from '../../api/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import { IPost, postApi } from '../../api/post';

export const userPostSlice = createSlice({
    name: 'userPosts',
    initialState: {
        posts: [] as IPost[],
        failure: false,
        loading: false,
    },
    reducers: {
        setPosts: (state, action: PayloadAction<IPost[]>) => {
            state.posts.push(...action.payload);
        },
        setFailure: (state, action) => {
            state.failure = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        reset: (state) => {
            state.posts = [];
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
            const i = state.posts.findIndex(
                (p) => p.post_id === post.post_id
            );
            console.log(state.posts[i]);
            state.posts[i] = post;
            console.log(state.posts[i]);

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
            dispatch(setPosts(res.data.result));
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
            dispatch(setPosts(res.data.result));
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

// export const { setPosts } = userPostSlice.actions;

export default userPostSlice.reducer;
