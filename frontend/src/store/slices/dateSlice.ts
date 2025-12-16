import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DateState {
    selectedDate: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

const initialState: DateState = {
    selectedDate: `${yyyy}-${mm}-${dd}`,
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
