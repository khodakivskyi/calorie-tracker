import {createAsyncThunk} from '@reduxjs/toolkit';
import {graphqlRequest} from "../../../config/graphqlClient.ts";

interface RegisterParams {
    email: string;
    password: string;
    name?: string;
}

export const registerUser = createAsyncThunk<string, RegisterParams, { rejectValue: string }>(
    'auth/register',
    async (params: RegisterParams, thunkAPI) => {
        try {
            const data = await graphqlRequest<{
                createUser: {
                    user: { id: number, email: string, name: string | null }
                }
            }>(
                `mutation CreateUser($email: String!, $password: String!, $name: String) {
                    createUser(email: $email, password: $password, name: $name) {
                        user { id email name }
                    }
                }`,
                params as unknown as Record<string, unknown>
            );

            return data.createUser.user.email;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error ?? 'Registration failed');
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
        try {
            const data = await graphqlRequest<{ verifyEmail: boolean }>(
                `mutation VerifyEmail($token: String!) {
                    verifyEmail(token: $token)
                }`,
                params as unknown as Record<string, unknown>
            )

            return data.verifyEmail;
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

export const authenticateUser = createAsyncThunk<
        { accessToken: string; user: { id: number; email: string; name: string | null } },
        AuthenticateUserParams,
        { rejectValue: string }>
(
    'auth/authenticateUser',
    async (params: AuthenticateUserParams, thunkAPI) => {
        try {
            const data = await graphqlRequest<{
                authenticateUser: {
                    user: { id: number, email: string, name: string | null };
                    accessToken: string;
                }
            }>(
                `query AuthenticateUser($email: String!, $password: String!) {
                    authenticateUser(email: $email, password: $password) {
                        user { id email name }
                        accessToken
                    }
                }`,
                params as unknown as Record<string, unknown>
            );

            return {
                accessToken: data.authenticateUser.accessToken,
                user: data.authenticateUser.user
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error ?? 'Authentication failed');
            return thunkAPI.rejectWithValue(message);
        }
    }
);