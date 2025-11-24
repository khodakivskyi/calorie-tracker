export type Meal = {
    id: number;
    name: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
};

import {
    createMealRequest,
    createMealSuccess,
    createMealFailure
} from '../slices/mealSlice.ts';

export type MealAction =
    | ReturnType<typeof createMealRequest>
    | ReturnType<typeof createMealSuccess>
    | ReturnType<typeof createMealFailure>;