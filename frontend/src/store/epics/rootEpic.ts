import {combineEpics} from 'redux-observable';
import {registerUserEpic} from "./registerUserEpic.ts";

export const rootEpic = combineEpics(
    registerUserEpic
)