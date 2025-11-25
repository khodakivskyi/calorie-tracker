import type {Food} from "./foodTypes.ts";

export type Dish = {
    id: number;
    name: string;
    ownerId: number | null;
    weight: number;
    imageId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    externalId?: string | null;
    foods?: DishFood[];
};

export type DishFood = {
    foodId: number;
    quantity: number;
    food?: Food;
};