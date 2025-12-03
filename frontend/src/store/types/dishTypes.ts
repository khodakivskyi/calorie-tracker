import type {Food} from "./foodTypes.ts";
import {createDishFailure, createDishRequest, createDishSuccess, getDishesByUserRequest, getDishesByUserSuccess, getDishesByUserFailure} from "../slices/dishesSlice.ts";

export type Dish = {
    id: number;
    name: string;
    ownerId: number | null;
    weight: number;
    imageId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    foods?: DishFood[];
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
    | ReturnType<typeof getDishesByUserFailure>;