import type {AuthAction} from "../types.ts";
import type {ProfileAction} from "../types/profileTypes.ts";
import type {MealAction} from "../types/mealTypes.ts";
import type {RootState} from "../slices/rootReducer.ts";
import {combineEpics} from 'redux-observable';
import {registerUserEpic} from "./user/registerUserEpic.ts";
import {verifyEmailEpic} from "./user/verifyEmailEpic.ts";
import {authenticateUserEpic} from "./user/authenticateUserEpic.ts";
import {updateProfileEpic} from "./user/updateProfileEpic.ts";
import {addMealEpic} from "./meal/addMealEpic.ts";
import type {FoodAction} from "../types/foodTypes.ts";
import {createFoodEpic} from "./food/addFoodEpic.ts";
import {createDishEpic} from "./dish/addDishEpic.ts";
import {getFoodsByUserEpic} from "./food/getFoodsByUserEpic.ts";
import type {DishAction} from "../types/dishTypes.ts";
import {getDishesByUserEpic} from "./dish/getDishesByUserEpic.ts";
import {updateFoodEpic} from "./food/updateFoodEpic.ts";
import {updateDishEpic} from "./dish/updateDishEpic.ts";
import {deleteFoodEpic} from "./food/deleteFoodEpic.ts";
import {deleteDishEpic} from "./dish/deleteDishEpic.ts";
import { caloriesChartEpic } from './analytics/caloriesChartEpic.ts';
import { activityHeatmapEpic } from './analytics/activityHeatmapEpic.ts';
import type {ActivityHeatmapAction} from "../slices/activityHeatmapSlice.ts";
import type {CaloriesChartAction} from "../slices/caloriesChartSlice.ts";
import type {CalorieLimitAction} from "../types/calorieLimitTypes.ts";
import {setCalorieLimitEpic} from "./calorieLimit/setLimitEpic.ts"
import {getCalorieLimitEpic} from "./calorieLimit/getLimitEpic.ts";
import {removeCalorieLimitEpic} from "./calorieLimit/removeLimitEpic.ts";
import {getFoodsByDishEpic} from "./dish/getFoodsByDishEpic.ts";

export type RootEpicAction = AuthAction | ProfileAction | MealAction | FoodAction | DishAction | ActivityHeatmapAction | CaloriesChartAction | CalorieLimitAction;

export const rootEpic = combineEpics<RootEpicAction, RootEpicAction, RootState>(
    registerUserEpic,
    verifyEmailEpic,
    authenticateUserEpic,
    updateProfileEpic,
    addMealEpic,
    createFoodEpic,
    createDishEpic,
    getFoodsByUserEpic,
    getDishesByUserEpic,
    updateFoodEpic,
    updateDishEpic,
    deleteFoodEpic,
    deleteDishEpic,
    caloriesChartEpic,
    activityHeatmapEpic,
    setCalorieLimitEpic,
    getCalorieLimitEpic,
    removeCalorieLimitEpic,
    getFoodsByDishEpic
);
