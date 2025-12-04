import {createFoodFailure,
    createFoodRequest,
    createFoodSuccess,
    getFoodsByUserRequest,
    getFoodsByUserSuccess,
    getFoodsByUserFailure,
    updateFoodRequest,
    updateFoodSuccess,
    updateFoodFailure,
    deleteFoodRequest,
    deleteFoodSuccess,
    deleteFoodFailure} from "../slices/foodsSlice.ts";

export type Food = {
    id: number;
    name: string;
    ownerId: number | null;
    calories: number | null;//TODO: not null
    proteins?: number | null;
    fats?: number | null;
    carbohydrate?: number | null;
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
    | ReturnType<typeof updateFoodFailure>
    | ReturnType<typeof deleteFoodRequest>
    | ReturnType<typeof deleteFoodSuccess>
    | ReturnType<typeof deleteFoodFailure>;