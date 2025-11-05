import {createSlice} from '@reduxjs/toolkit';
import {registerUser, verifyEmail, authenticateUser} from "./thunks/authThunk.ts";

type AuthState = {
    loading: boolean;
    error: string | null;
    userEmail: string | null;
    verificationStatus: 'idle' | 'loading' | 'success' | 'error';
    isAuthenticated: boolean;
    token: string | null;
    authLoading: boolean;
};

const initialState: AuthState = {
    loading: false,
    error: null,
    userEmail: null,
    verificationStatus: 'idle',
    isAuthenticated: false,
    token: null,
    authLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.userEmail = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
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
            })
            .addCase(authenticateUser.pending, state => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
                state.error = null;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = (action as { payload?: string }).payload ?? action.error.message ?? 'Authentication failed';
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;