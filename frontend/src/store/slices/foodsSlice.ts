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
            _action: PayloadAction<{
                userId: number;
                name: string;
                imageId?: number | null;
                calories?: number | null;
                protein?: number | null;
                fat?: number | null;
                carbohydrate?: number | null;
            }>
        )
        {
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
        },
        getFoodsByUserRequest(state, _action: PayloadAction<{ userId: number }>) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },

        getFoodsByUserSuccess(state, action: PayloadAction<Food[]>) {
            state.loading = false;
            state.error = null;
            state.foods = action.payload;
        },

        getFoodsByUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;

        },
        updateFoodRequest(
            state,
            _action: PayloadAction<{
                foodId: number;
                userId: number;
                name?: string;
                imageId?: number;
                calories?: number;
                protein?: number;
                fat?: number;
                carbohydrate?: number;
            }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        updateFoodSuccess: (state, action: PayloadAction<Food>) => {
            state.loading = false;
            state.error = null;
            state.success = 'Food updated successfully';
            const index = state.foods.findIndex(f => f.id === action.payload.id);
            if (index !== -1) {
                state.foods[index] = action.payload;
            }
        },
        updateFoodFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        deleteFoodRequest(
            state,
            _action: PayloadAction<{ foodId: number; userId: number }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        deleteFoodSuccess(
            state,
            action: PayloadAction<{ foodId: number }>
        ) {
            state.loading = false;
            state.error = null;
            state.success = "Food deleted successfully";
            state.foods = state.foods.filter(f => f.id !== action.payload.foodId);
        },
        deleteFoodFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },

    }
});

export const {
    createFoodRequest,
    createFoodSuccess,
    createFoodFailure,
    getFoodsByUserRequest,
    getFoodsByUserSuccess,
    getFoodsByUserFailure,
    updateFoodRequest,
    updateFoodSuccess,
    updateFoodFailure,
    deleteFoodRequest,
    deleteFoodSuccess,
    deleteFoodFailure
} = foodSlice.actions;

export default foodSlice.reducer;

