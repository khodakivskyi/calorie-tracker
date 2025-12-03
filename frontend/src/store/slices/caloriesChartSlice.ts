import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChartDataPoint {
    name: string;
    calories: number;
}

interface CaloriesChartState {
    data: ChartDataPoint[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CaloriesChartState = {
    data: [],
    isLoading: false,
    error: null,
};

const caloriesChartSlice = createSlice({
    name: 'caloriesChart',
    initialState,
    reducers: {
        fetchChartDataRequest: (state, action: PayloadAction<{ period: 'Week' | 'Month' | 'Year' }>) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchChartDataSuccess: (state, action: PayloadAction<ChartDataPoint[]>) => {
            state.isLoading = false;
            state.data = action.payload;
        },
        fetchChartDataFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchChartDataRequest, fetchChartDataSuccess, fetchChartDataFailure } = caloriesChartSlice.actions;
export default caloriesChartSlice.reducer;