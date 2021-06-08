import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import postsReducer from './slices/userPosts';
import peopleReducer from './slices/people';
import commentsReducer from './slices/comments';
import appReducer from './slices/app';

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        people: peopleReducer,
        comments: commentsReducer,
        app: appReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, null, Action<any>>;

export default store;
