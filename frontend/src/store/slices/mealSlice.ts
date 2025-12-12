import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Meal, MealDish } from '../types/mealTypes.ts';

type MealState = {
    meals: (Meal & { dishes?: MealDish[] })[];
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
        // Create Meal
        createMealRequest(
            state,
            _action: PayloadAction<{
                ownerId: number;
                typeId: number;
                name?: string;
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
        },

        // Get Meals By User
        getMealsByUserRequest(state, _action: PayloadAction<{ ownerId: number }>) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        getMealsByUserSuccess(state, action: PayloadAction<Meal[]>) {
            state.loading = false;
            state.error = null;
            state.success = 'Meals loaded successfully';
            state.meals = action.payload;
        },
        getMealsByUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },

        // Get Dishes By Meal
        getDishesByMealRequest(
            state,
            _action: PayloadAction<{ mealId: number }>
        ) {
            state.loading = true;
            state.error = null;
        },
        getDishesByMealSuccess(
            state,
            action: PayloadAction<{ mealId: number; dishes: MealDish[] }>
        ) {
            state.loading = false;
            state.error = null;
            const meal = state.meals.find(m => m.id === action.payload.mealId);
            if (meal) {
                meal.dishes = action.payload.dishes;
            }
        },
        getDishesByMealFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    createMealRequest,
    createMealSuccess,
    createMealFailure,
    getMealsByUserRequest,
    getMealsByUserSuccess,
    getMealsByUserFailure,
    getDishesByMealRequest,
    getDishesByMealSuccess,
    getDishesByMealFailure
} = mealSlice.actions;

export default mealSlice.reducer;
