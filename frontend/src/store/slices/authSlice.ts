import {createSlice} from '@reduxjs/toolkit';
import {registerUser, verifyEmail, authenticateUser} from "./thunks/authThunk.ts";

type AuthUser = {
    id: number;
    email: string;
    name: string | null;
}

type AuthState = {
    loading: boolean;
    authLoading: boolean;
    error: string | null;
    userEmail: string | null;
    verificationStatus: 'idle' | 'loading' | 'success' | 'error';
    isAuthenticated: boolean;
    accessToken: string | null;
    user: AuthUser | null;
};

const initialState: AuthState = {
    loading: false,
    authLoading: false,
    error: null,
    userEmail: null,
    verificationStatus: 'idle',
    isAuthenticated: false,
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
            state.accessToken = null;
            state.user = null;
            state.userEmail = null;
            state.error = null;
            state.verificationStatus = 'idle';
            state.loading = false;
            state.authLoading = false;
        },
        /*clearError: (state) => {
            state.error = null;
        }*/
    },
    extraReducers: builder => {
        builder

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userEmail = action.payload; // for default email-input value in loginForm
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Registration failed';
            })

            // Login
            .addCase(authenticateUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
                state.error = action.payload ?? 'Login failed';
            })

            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.verificationStatus = 'loading';
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.verificationStatus = 'success';
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.verificationStatus = 'error';
                state.error = action.payload ?? 'Verification failed';
            })
    }
});

export const { setAccessToken, logout, /*clearError*/ } = authSlice.actions;
export default authSlice.reducer;