import {createFoodFailure, createFoodRequest, createFoodSuccess, getFoodsByUserRequest, getFoodsByUserSuccess, getFoodsByUserFailure, updateFoodRequest, updateFoodSuccess, updateFoodFailure} from "../slices/foodsSlice.ts";

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
    | ReturnType<typeof getFoodsByUserFailure>
    | ReturnType<typeof updateFoodRequest>
    | ReturnType<typeof updateFoodSuccess>
    | ReturnType<typeof updateFoodFailure>;