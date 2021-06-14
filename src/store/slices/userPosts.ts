import { mediaApi } from './../../api/media';
import { IPaginationResponse, userApi } from '../../api/user';
import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '..';
import { IPost, postApi } from '../../api/post';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
    posts: [] as IPost[],
    total_count: 0,
    total_pages: 1,
    failure: false,
    loading: true,
    attachments: [] as string[],
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
        setAttachments: (state, action: PayloadAction<string[]>) => {
            state.attachments = action.payload;
        },
        resetAttachments: (state) => {
            state.attachments = [];
        },
    },
});

const {
    setPosts,
    setFailure,
    setLoading,
    appendPost,
    deletePost,
    update,
    resetAttachments,
} = userPostSlice.actions;
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
    async (dispatch, getState) => {
        try {
            dispatch(setLoading(true));
            const res = await postApi.create({ message: text });
            res.data.attachments = getState().posts.attachments;
            console.log(res.data);
            dispatch(appendPost(res.data));
            await mediaApi.attach({
                body: getState().posts.attachments,
                post_id: res.data.post_id,
            });
            dispatch(resetAttachments());
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

export const userPostActions = userPostSlice.actions;

const selectPosts = (state: RootState): IPost[] => state.posts.posts;
export const selectPost = (post_id: number) =>
    createSelector<RootState, IPost[], IPost | null>(selectPosts, (posts) => {
       
        let l = 0,
            r = posts.length - 1;
        while (l !== r) {
            let m = Math.floor((l + r) / 2);
            if (posts[m].post_id === post_id) {
                return posts[m];
            } else if (posts[m].post_id < post_id) {
                r = m - 1;
            } else {
                l = m + 1;
            }
        }
        if (posts[l].post_id === post_id) {
            return posts[l];
        }
        return null;
    });
export default userPostSlice.reducer;
