import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalorieLimit } from "../types/calorieLimitTypes";

type CalorieLimitState = {
    limit: CalorieLimit | null;
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: CalorieLimitState = {
    limit: null,
    loading: false,
    error: null,
    success: null,
};

const calorieLimitSlice = createSlice({
    name: "calorieLimit",
    initialState,
    reducers: {
        getLimitRequest(state, _action: PayloadAction<{ ownerId: number }>) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },

        getLimitSuccess(state, action: PayloadAction<CalorieLimit | null>) {
            state.loading = false;
            state.error = null;
            state.limit = action.payload;
        },

        getLimitFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },

        setLimitRequest(
            state,
            _action: PayloadAction<{ ownerId: number; limitValue: number }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },

        setLimitSuccess(state, action: PayloadAction<CalorieLimit>) {
            state.loading = false;
            state.error = null;
            state.success = "Calorie limit updated successfully";
            state.limit = action.payload;
        },

        setLimitFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },

        removeLimitRequest(state, _action: PayloadAction<{ ownerId: number }>) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },

        removeLimitSuccess(state) {
            state.loading = false;
            state.error = null;
            state.success = "Calorie limit removed successfully";
            state.limit = null;
        },

        removeLimitFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        }
    },
});

export const {
    getLimitRequest,
    getLimitSuccess,
    getLimitFailure,
    setLimitRequest,
    setLimitSuccess,
    setLimitFailure,
    removeLimitRequest,
    removeLimitSuccess,
    removeLimitFailure,
} = calorieLimitSlice.actions;

export default calorieLimitSlice.reducer;
