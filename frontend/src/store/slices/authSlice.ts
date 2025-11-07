import {createSlice} from '@reduxjs/toolkit';
import {registerUser, verifyEmail, authenticateUser, refreshToken} from "./thunks/authThunk.ts";

type AuthState = {
    loading: boolean;
    error: string | null;
    userEmail: string | null;
    verificationStatus: 'idle' | 'loading' | 'success' | 'error';
    isAuthenticated: boolean;
    token: string | null;
    authLoading: boolean;
    accessToken: string | null;
    user: {
        id: number;
        email: string;
        name: string;
    } | null;
};

const initialState: AuthState = {
    loading: false,
    error: null,
    userEmail: null,
    verificationStatus: 'idle',
    isAuthenticated: false,
    token: null,
    authLoading: false,
    accessToken: null,
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
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
            // Register
            .addCase(registerUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Registration failed';
            })
            // Login
            .addCase(authenticateUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Login failed';
            })
            // Verify Email
            .addCase(verifyEmail.pending, state => {
                state.verificationStatus = 'loading';
            })
            .addCase(verifyEmail.fulfilled, state => {
                state.verificationStatus = 'success';
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.verificationStatus = 'error';
                state.error = action.payload ?? 'Verification failed';
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
            });
    }
});

export const { setAccessToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;