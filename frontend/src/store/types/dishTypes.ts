import type {Food} from "./foodTypes.ts";
import {createDishFailure,
    createDishRequest,
    createDishSuccess,
    getDishesByUserRequest,
    getDishesByUserSuccess,
    getDishesByUserFailure,
    updateDishRequest,
    updateDishSuccess,
    updateDishFailure,
    deleteDishRequest,
    deleteDishSuccess,
    deleteDishFailure} from "../slices/dishesSlice.ts";

export type Dish = {
    id: number;
    name: string;
    userId: number | null;
    weight: number;
    calories: number | null;//TODO: not null
    proteins?: number | null;
    fats?: number | null;
    carbs?: number | null;
    imageId?: number | null;
    createdAt: Date;
    updatedAt: Date;
};

//probably need improve
export type DishFood = {
    foodId: number;
    quantity: number;
    food?: Food;
};

export type DishAction =
    | ReturnType<typeof createDishRequest>
    | ReturnType<typeof createDishSuccess>
    | ReturnType<typeof createDishFailure>
    | ReturnType<typeof getDishesByUserRequest>
    | ReturnType<typeof getDishesByUserSuccess>
    | ReturnType<typeof getDishesByUserFailure>
    | ReturnType<typeof updateDishRequest>
    | ReturnType<typeof updateDishSuccess>
    | ReturnType<typeof updateDishFailure>
    | ReturnType<typeof deleteDishRequest>
    | ReturnType<typeof deleteDishSuccess>
    | ReturnType<typeof deleteDishFailure>;