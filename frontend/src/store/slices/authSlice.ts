import {createSlice} from '@reduxjs/toolkit';
import {registerUser, verifyEmail} from "./thunks/authThunk.ts";

type AuthState = {
    loading: boolean;
    error: string | null;
    userEmail: string | null;
    verificationStatus: 'idle' | 'loading' | 'success' | 'error';
};

const initialState: AuthState = {
    loading: false,
    error: null,
    userEmail: null,
    verificationStatus: 'idle'
};

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
            })
            .addCase(verifyEmail.pending, state => {
                state.verificationStatus = 'loading';
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, state => {
                state.verificationStatus = 'success';
                state.error = null;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.verificationStatus = 'error';
                state.error = (action as { payload?: string }).payload ?? action.error.message ?? 'Verification failed';
            });
    }
});

export default authSlice.reducer;