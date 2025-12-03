import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Dish } from '../types/dishTypes.ts';

type DishesState = {
    dishes: Dish[];
    loading: boolean;
    error: string | null;
    success: string | null;
};

const initialState: DishesState = {
    dishes: [],
    loading: false,
    error: null,
    success: null,
};

const dishesSlice = createSlice({
    name: 'dishes',
    initialState,
    reducers: {
        createDishRequest(
            state,
            _action: PayloadAction<{ userId?: number; name: string; weight: number }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        createDishSuccess: (state, action: PayloadAction<Dish>) => {
            state.loading = false;
            state.error = null;
            state.success = 'Dish added successfully';
            state.dishes.push(action.payload);
        },
        createDishFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        getDishesByUserRequest(state, _action: PayloadAction<{ userId: number }>) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },

        getDishesByUserSuccess(state, action: PayloadAction<Dish[]>) {
            state.loading = false;
            state.error = null;
            state.dishes = action.payload;
        },

        getDishesByUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateDishRequest(
            state,
            _action: PayloadAction<{
                dishId: number;
                userId: number;
                weight?: number;
                name?: string;
                externalId?: string;
            }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        updateDishSuccess(state, action: PayloadAction<Dish>) {
            state.loading = false;
            state.error = null;
            state.success = 'Dish updated successfully';
            const index = state.dishes.findIndex(d => d.id === action.payload.id);
            if (index !== -1) {
                state.dishes[index] = action.payload;
            }
        },
        updateDishFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
    },
});

export const {
    createDishRequest,
    createDishSuccess,
    createDishFailure,
    getDishesByUserRequest,
    getDishesByUserSuccess,
    getDishesByUserFailure,
    updateDishRequest,
    updateDishSuccess,
    updateDishFailure
} = dishesSlice.actions;

export default dishesSlice.reducer;
