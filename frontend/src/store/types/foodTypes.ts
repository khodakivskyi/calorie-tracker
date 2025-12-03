import {createFoodFailure, createFoodRequest, createFoodSuccess, getFoodsByUserRequest, getFoodsByUserSuccess, getFoodsByUserFailure} from "../slices/foodsSlice.ts";

export type Food = {
    id: number;
    name: string;
    userId: number | null;
    calories?: number | null;
    protein?: number | null;
    fat?: number | null;
    carbohydrates?: number | null;
    imageId?: number | null;
    createdAt: Date;
    updatedAt: Date;
};

export type FoodAction =
    | ReturnType<typeof createFoodRequest>
    | ReturnType<typeof createFoodSuccess>
    | ReturnType<typeof createFoodFailure>
    | ReturnType<typeof getFoodsByUserRequest>
    | ReturnType<typeof getFoodsByUserSuccess>
    | ReturnType<typeof getFoodsByUserFailure>;