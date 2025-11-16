import {combineEpics} from 'redux-observable';
import {registerUserEpic} from "./registerUserEpic.ts";
import {verifyEmailEpic} from "./verifyEmailEpic.ts";
import {authenticateUserEpic} from "./authenticateUserEpic.ts";

export const rootEpic = combineEpics(
    registerUserEpic,
    verifyEmailEpic,
    authenticateUserEpic
)