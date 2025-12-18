import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Dish } from '../types/dishTypes.ts';

type DishesState = {
    dishes: Dish[];
    loading: boolean;        // для CRUD страв
    foodsLoading: boolean;   // ТІЛЬКИ для getFoodsByDish
    error: string | null;
    success: string | null;
};


const initialState: DishesState = {
    dishes: [],
    loading: false,
    foodsLoading: false,
    error: null,
    success: null,
};


const dishesSlice = createSlice({
    name: 'dishes',
    initialState,
    reducers: {
        createDishRequest(
            state,
            _action: PayloadAction<{ ownerId?: number; name: string; weight: number,  imageId?: number | null; }>
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
        getDishesByUserRequest(state, _action: PayloadAction<{ ownerId: number }>) {
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
            state.success = null;
        },
        updateDishRequest(
            state,
            _action: PayloadAction<{
                dishId: number;
                ownerId: number;
                weight?: number;
                name?: string;
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
        deleteDishRequest(
            state,
            _action: PayloadAction<{ dishId: number; ownerId: number }>
        ) {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        deleteDishSuccess(
            state,
            action: PayloadAction<{ dishId: number }>
        ) {
            state.loading = false;
            state.error = null;
            state.success = "Dish deleted successfully";
            state.dishes = state.dishes.filter(d => d.id !== action.payload.dishId);
        },
        deleteDishFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        getFoodsByDishRequest(
            state,
            _action: PayloadAction<{ ownerId: number; dishId: number }>
        ) {
            state.foodsLoading = true;
            state.error = null;
        },


        getFoodsByDishSuccess(state, action) {
            state.foodsLoading = false;

            const dish = state.dishes.find(d => d.id === action.payload.dishId);
            if (dish) {
                dish.foods = action.payload.foods;
            }
        },

        getFoodsByDishFailure(state, action) {
            state.foodsLoading = false;
            state.error = action.payload;
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
    updateDishFailure,
    deleteDishRequest,
    deleteDishSuccess,
    deleteDishFailure,
    getFoodsByDishRequest,
    getFoodsByDishSuccess,
    getFoodsByDishFailure
} = dishesSlice.actions;

export default dishesSlice.reducer;
