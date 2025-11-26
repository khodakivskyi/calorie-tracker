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

export type RootEpicAction = AuthAction | ProfileAction | MealAction;

export const rootEpic = combineEpics<RootEpicAction, RootEpicAction, RootState>(
    registerUserEpic,
    verifyEmailEpic,
    authenticateUserEpic,
    updateProfileEpic,
    addMealEpic
);
