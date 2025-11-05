import {createAsyncThunk} from '@reduxjs/toolkit';
import {API_CONFIG} from '../../../config/api';

interface RegisterParams {
    email: string;
    password: string;
    name?: string;
}

export const registerUser = createAsyncThunk<string, RegisterParams, { rejectValue: string }>(
    'auth/register',
    async (params: RegisterParams, thunkAPI) => {
        const {email, password, name} = params;

        try {
            const response = await fetch(API_CONFIG.GRAPHQL_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                    'GraphQL-Require-Preflight': 'true'},
                body: JSON.stringify({
                    query: `mutation CreateUser($email: String!, $password: String!, $name: String) {
                                createUser(email: $email, password: $password, name: $name) {
                                    user { id email name }
                                    token
                                }
                            }`,
                    variables: {email, password, name},
                })
            });

            const data = await response.json();
            if (data?.errors) {
                return thunkAPI.rejectWithValue(String(data.errors[0]?.message ?? 'Registration failed'));
            }
            return email;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error ?? 'Network error');
            return thunkAPI.rejectWithValue(message);
        }
    }
);

interface VerifyEmailParams {
    token: string;
}

export const verifyEmail = createAsyncThunk<boolean, VerifyEmailParams, { rejectValue: string }>(
    'auth/verifyEmail',
    async (params: VerifyEmailParams, thunkAPI) => {
        const {token} = params;

        try {
            const response = await fetch(API_CONFIG.GRAPHQL_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `mutation VerifyEmail($token: String!) {
                                verifyEmail(token: $token)
                            }`,
                    variables: {token},
                }),
            });

            const data = await response.json();
            
            if (data?.errors) {
                return thunkAPI.rejectWithValue(String(data.errors[0]?.message ?? 'Verification failed'));
            }
            
            if (data?.data?.verifyEmail === true) {
                return true;
            }
            
            return thunkAPI.rejectWithValue('Verification failed');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error ?? 'Network error');
            return thunkAPI.rejectWithValue(message);
        }
    }
);

interface AuthenticateUserParams {
    email: string;
    password: string;
}

export const authenticateUser = createAsyncThunk<string, AuthenticateUserParams, { rejectValue: string }>(
    'auth/authenticateUser',
    async (params: AuthenticateUserParams, thunkAPI) => {
        const {email, password} = params;

        try{
            const response = await fetch(API_CONFIG.GRAPHQL_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `query AuthenticateUser($email: String!, $password: String!) {
                                authenticateUser(email: $email, password: $password) {
                                    user { id email name }
                                    token
                                }
                            }`,
                    variables: {email, password},
                }),
            });

            const data = await response.json();

            if (data?.errors) {
                return thunkAPI.rejectWithValue(String(data.errors[0]?.message ?? 'Authentication failed'));
            }

            if (data?.data?.authenticateUser?.user?.email) {
                // localStorage.setItem('token', data.data.authenticateUser.token);
                return data.data.authenticateUser.user.email;
            }

            return thunkAPI.rejectWithValue('Authentication failed');
        }
        catch(error: unknown) {
            const message = error instanceof Error ? error.message : String(error ?? 'Network error');
            return thunkAPI.rejectWithValue(message);
        }
    }
)