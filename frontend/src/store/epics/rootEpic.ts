import type {AuthAction} from "../types.ts";
import type {ProfileAction} from "../types/profileTypes.ts";
import type {MealAction} from "../types/mealTypes.ts";
import type {RootState} from "../slices/rootReducer.ts";
import {combineEpics} from 'redux-observable';
import {registerUserEpic} from "./registerUserEpic.ts";
import {verifyEmailEpic} from "./verifyEmailEpic.ts";
import {authenticateUserEpic} from "./authenticateUserEpic.ts";
import {updateProfileEpic} from "./updateProfileEpic.ts";
import {addMealEpic} from "./addMealEpic.ts";
import type {FoodAction} from "../types/foodTypes.ts";
import {createFoodEpic} from "./addFoodEpic.ts";
import {createDishEpic} from "./addDishEpic.ts";
import {getFoodsByUserEpic} from "./getFoodsByUserEpic.ts";
import type {DishAction} from "../types/dishTypes.ts";
import {getDishesByUserEpic} from "./getDishesByUserEpic.ts";

export type RootEpicAction = AuthAction | ProfileAction | MealAction | FoodAction | DishAction;

export const rootEpic = combineEpics<RootEpicAction, RootEpicAction, RootState>(
    registerUserEpic,
    verifyEmailEpic,
    authenticateUserEpic,
    updateProfileEpic,
    addMealEpic,
    createFoodEpic,
    createDishEpic,
    getFoodsByUserEpic,
    getDishesByUserEpic
);
