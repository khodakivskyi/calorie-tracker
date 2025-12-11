import type {Dish} from "./dishTypes.ts";
import {
    createMealRequest,
    createMealSuccess,
    createMealFailure
} from '../slices/mealSlice.ts';

export type Meal = {
    id: number;
    name: string;
    ownerId: number;
    typeId: number;
    calories: number | null;
    protein: number | null;
    carbohydrate: number | null;
    fat: number | null;
    createdAt: string;
    updatedAt: string;
};

//probably need improve
export type MealDish = {
    dishId: number;
    weight: number;
    dish?: Dish;
};

export type MealAction =
    | ReturnType<typeof createMealRequest>
    | ReturnType<typeof createMealSuccess>
    | ReturnType<typeof createMealFailure>;