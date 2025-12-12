import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DateState {
    selectedDate: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState: DateState = {
    selectedDate: today.toISOString().split('T')[0],
};

const dateSlice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setSelectedDate(state, action: PayloadAction<string>) {
            state.selectedDate = action.payload;
        },
    },
});

export const { setSelectedDate } = dateSlice.actions;
export default dateSlice.reducer;
