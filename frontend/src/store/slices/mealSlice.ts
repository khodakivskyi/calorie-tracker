import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Meal} from '../types/mealTypes.ts';

type MealState = {
    meals: Meal[]
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: MealState = {
    meals: [],
    loading: false,
    error: null,
    success: null,
};

const mealSlice = createSlice({
    name: 'meal',
    initialState,
    reducers: {
        createMealRequest(
            state,
            _action: PayloadAction<{ 
                ownerId: number; 
                typeId: number; 
                name: string; 
                dishes?: Array<{ dishId: number; weight: number }> 
            }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        createMealSuccess: (state, action: PayloadAction<Meal>) => {
            state.loading = false;
            state.error = null;
            state.success = 'Meal added successfully';
            state.meals.push(action.payload);
        },
        createMealFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        }
    }
});

export const {
    createMealRequest,
    createMealSuccess,
    createMealFailure

} = mealSlice.actions;

export default mealSlice.reducer;

