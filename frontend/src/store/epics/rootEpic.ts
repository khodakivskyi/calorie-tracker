import {combineEpics} from 'redux-observable';
import {registerUserEpic} from "./registerUserEpic.ts";
import {verifyEmailEpic} from "./verifyEmailEpic.ts";
import {authenticateUserEpic} from "./authenticateUserEpic.ts";
import {updateProfileEpic} from "./profileEpic.ts";
import type {AuthAction} from "../types.ts";
import type {ProfileAction} from "../types/profileTypes.ts";
import type {RootState} from "../slices/rootReducer.ts";

export type RootEpicAction = AuthAction | ProfileAction;

export const rootEpic = combineEpics<RootEpicAction, RootEpicAction, RootState>(
    registerUserEpic,
    verifyEmailEpic,
    authenticateUserEpic,
    updateProfileEpic
);
