import {createAsyncThunk} from '@reduxjs/toolkit';

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
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `mutation RegisterUser($email: String!, $password: String!, $name: String) {
                            registerUser(email: $email, password: $password, name: $name)}`,
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
)