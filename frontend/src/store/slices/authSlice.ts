import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

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
        registerUserRequest: {
            reducer(state) {
                state.loading = true;
                state.error = null;
            },
            prepare(email: string, password: string, name?: string | null) {
                return {
                    payload: { email, password, name: name ?? null}
                };
            }
        },
        registerUserSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.userEmail = action.payload;
        },
        registerUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },


        authenticateUserRequest: {
            reducer(state) {
                state.authLoading = true;
                state.error = null;
            },
            prepare(email: string, password: string) {
                return {
                    payload: { email, password }
                };
            }
        },
        authenticateUserSuccess: (
            state,
            action: PayloadAction<{ accessToken: string; user: AuthUser }>
        ) => {
            state.authLoading = false;
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        authenticateUserFailure: (state, action: PayloadAction<string>) => {
            state.authLoading = false;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.user = null;
            state.error = action.payload;
        },


        verifyEmailRequest: {
            reducer(state) {
                state.verificationStatus = 'loading';
                state.error = null;
            },
            prepare(token: string) {
                return {
                    payload: { token }
                };
            }
        },
        verifyEmailSuccess: (state) => {
            state.verificationStatus = 'success';
        },
        verifyEmailFailure: (state, action: PayloadAction<string>) => {
            state.verificationStatus = 'error';
            state.error = action.payload;
        },


        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
        logout: state => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.user = null;
            state.userEmail = null;
            state.error = null;
            state.verificationStatus = 'idle';
            state.loading = false;
            state.authLoading = false;
        },
    }
});

export const {
    registerUserRequest,
    registerUserSuccess,
    registerUserFailure,
    authenticateUserRequest,
    authenticateUserSuccess,
    authenticateUserFailure,
    verifyEmailRequest,
    verifyEmailSuccess,
    verifyEmailFailure,
    setAccessToken,
    logout,
} = authSlice.actions;

export default authSlice.reducer;