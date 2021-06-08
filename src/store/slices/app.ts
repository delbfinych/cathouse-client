import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,
};
export const userPostSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const appActions = userPostSlice.actions;

export default userPostSlice.reducer;
