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
    ownerId: number | null;
    weight: number;
    calories?: number | null;
    protein?: number | null;
    fat?: number | null;
    carbohydrate?: number | null;
    imageId?: number | null;
    createdAt: string;
    updatedAt: string;
    foods?: DishFood[];
};

export type DishFood = {
    foodId: number;
    weight?: number;
    food?: Food;
};

export type DishWithFoods = Dish & {
    foods?: DishFood[];
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