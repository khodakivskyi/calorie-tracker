import {createAsyncThunk} from '@reduxjs/toolkit';

interface RegisterParams{
    email: string;
    password: string;
    name?: string;
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (params: RegisterParams, thunkAPI) => {
        const { email, password, name } = params;

        try{
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation RegisterUser($email: String!, $password: String!, $name: String) {
                            registerUser(email: $email, password: $password, name: $name)}`,
                    variables: {email, password, name},
                })
            });

            const data = await response.json();
            if (data.errors) return thunkAPI.rejectWithValue(data.error[0].message);

            return  //
        }
        catch(error){}
    }
)