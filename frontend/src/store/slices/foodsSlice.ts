import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Food} from '../types/foodTypes.ts';

type FoodState = {
    foods: Food[]
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: FoodState = {
    foods: [],
    loading: false,
    error: null,
    success: null,
};

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        createFoodRequest(
            state,
            _action: PayloadAction<{ userId: number; typeId: number; name: string }>//
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        createFoodSuccess: (state, action: PayloadAction<Food>) => {
            state.loading = false;
            state.error = null;
            state.success = 'Food added successfully';
            state.foods.push(action.payload);
        },
        createFoodFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        }
    }
});

export const {
    createFoodRequest,
    createFoodSuccess,
    createFoodFailure

} = foodSlice.actions;

export default foodSlice.reducer;

