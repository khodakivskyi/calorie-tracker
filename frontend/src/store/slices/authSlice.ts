import {createSlice} from '@reduxjs/toolkit';
import {registerUser} from "./thunks/authThunk.ts";

type AuthState = {
    loading: boolean;
    error: string | null;
    userEmail: string | null;
};

const initialState: AuthState = {loading: false, error: null, userEmail: null};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(registerUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userEmail = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action as { payload?: string }).payload ?? action.error.message ?? 'Unknown error';
            });
    }
});

export default authSlice.reducer;