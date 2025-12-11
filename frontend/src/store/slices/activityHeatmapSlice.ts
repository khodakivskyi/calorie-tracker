import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface HeatmapLog {
    date: string;
    calories: number;
}

interface ActivityHeatmapState {
    logs: HeatmapLog[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ActivityHeatmapState = {
    logs: [],
    isLoading: false,
    error: null,
};

const activityHeatmapSlice = createSlice({
    name: 'activityHeatmap',
    initialState,
    reducers: {
        fetchHeatmapRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchHeatmapSuccess: (state, action: PayloadAction<HeatmapLog[]>) => {
            state.isLoading = false;
            state.logs = action.payload;
        },
        fetchHeatmapFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchHeatmapRequest, fetchHeatmapSuccess, fetchHeatmapFailure } = activityHeatmapSlice.actions;
export default activityHeatmapSlice.reducer;
export type ActivityHeatmapAction =
    | ReturnType<typeof fetchHeatmapRequest>
    | ReturnType<typeof fetchHeatmapSuccess>
    | ReturnType<typeof fetchHeatmapFailure>;