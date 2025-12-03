import { combineReducers } from '@reduxjs/toolkit';
import authReducer, * as authActions from './authSlice';
import profileReducer, * as profileActions from './profileSlice.ts';
import mealReducer, * as mealActions from './mealSlice.ts';
import foodReducer, * as foodActions from './foodsSlice.ts';
import dishReducer, * as dishActions from './dishesSlice.ts';
import caloriesChartReducer, * as caloriesChartActions from './caloriesChartSlice';
import activityHeatmapReducer, * as activityHeatmapActions from './activityHeatmapSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    meal: mealReducer,
    food: foodReducer,
    dish: dishReducer,
    caloriesChart: caloriesChartReducer,
    activityHeatmap: activityHeatmapReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type RootAction =
    | ReturnType<typeof authActions.registerUserRequest>
    | ReturnType<typeof authActions.registerUserSuccess>
    | ReturnType<typeof authActions.registerUserFailure>
    | ReturnType<typeof authActions.authenticateUserRequest>
    | ReturnType<typeof authActions.authenticateUserSuccess>
    | ReturnType<typeof authActions.authenticateUserFailure>
    | ReturnType<typeof authActions.verifyEmailRequest>
    | ReturnType<typeof authActions.verifyEmailSuccess>
    | ReturnType<typeof authActions.verifyEmailFailure>
    | ReturnType<typeof authActions.setAccessToken>
    | ReturnType<typeof authActions.logout>
    | ReturnType<typeof profileActions.updateProfileRequest>
    | ReturnType<typeof profileActions.updateProfileSuccess>
    | ReturnType<typeof profileActions.updateProfileFailure>
    | ReturnType<typeof profileActions.clearSettingsMessages>
    | ReturnType<typeof mealActions.createMealRequest>
    | ReturnType<typeof mealActions.createMealSuccess>
    | ReturnType<typeof mealActions.createMealFailure>
    | ReturnType<typeof foodActions.createFoodRequest>
    | ReturnType<typeof foodActions.createFoodSuccess>
    | ReturnType<typeof foodActions.createFoodFailure>
    | ReturnType<typeof foodActions.getFoodsByUserRequest>
    | ReturnType<typeof foodActions.getFoodsByUserSuccess>
    | ReturnType<typeof foodActions.getFoodsByUserFailure>
    | ReturnType<typeof dishActions.createDishRequest>
    | ReturnType<typeof dishActions.createDishSuccess>
    | ReturnType<typeof dishActions.createDishFailure>
    | ReturnType<typeof dishActions.getDishesByUserRequest>
    | ReturnType<typeof dishActions.getDishesByUserSuccess>
    | ReturnType<typeof dishActions.getDishesByUserFailure>
    | ReturnType<typeof foodActions.updateFoodRequest>
    | ReturnType<typeof foodActions.updateFoodSuccess>
    | ReturnType<typeof foodActions.updateFoodFailure>
    | ReturnType<typeof dishActions.updateDishRequest>
    | ReturnType<typeof dishActions.updateDishSuccess>
    | ReturnType<typeof dishActions.updateDishFailure>
    | ReturnType<typeof foodActions.deleteFoodRequest>
    | ReturnType<typeof foodActions.deleteFoodSuccess>
    | ReturnType<typeof foodActions.deleteFoodFailure>
    | ReturnType<typeof dishActions.deleteDishRequest>
    | ReturnType<typeof dishActions.deleteDishSuccess>
    | ReturnType<typeof dishActions.deleteDishFailure>
    | ReturnType<typeof caloriesChartActions.fetchChartDataRequest>
    | ReturnType<typeof caloriesChartActions.fetchChartDataSuccess>
    | ReturnType<typeof caloriesChartActions.fetchChartDataFailure>
    | ReturnType<typeof activityHeatmapActions.fetchHeatmapRequest>
    | ReturnType<typeof activityHeatmapActions.fetchHeatmapSuccess>
    | ReturnType<typeof activityHeatmapActions.fetchHeatmapFailure>;
