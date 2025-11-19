import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type SettingsState = {
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: SettingsState = {
    loading: false,
    error: null,
    success: null,
};

const settingsSlice = createSlice({
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
            state.success = 'Профіль успішно оновлено';
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
} = settingsSlice.actions;

export default settingsSlice.reducer;

