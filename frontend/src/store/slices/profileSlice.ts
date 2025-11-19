import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type ProfileState = {
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: ProfileState = {
    loading: false,
    error: null,
    success: null,
};

const profileSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateProfileRequest: {
            reducer(state) {
                state.loading = true;
                state.error = null;
                state.success = null;
            },
            prepare(name?: string | null, password?: string | null) {
                return {
                    payload: { name: name ?? null, password: password ?? null }
                };
            }
        },
        updateProfileSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.success = 'Profile updated successfully';
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        clearSettingsMessages: (state) => {
            state.error = null;
            state.success = null;
        },
    }
});

export const {
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
    clearSettingsMessages,
} = profileSlice.actions;

export default profileSlice.reducer;

