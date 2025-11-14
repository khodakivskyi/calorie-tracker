import { combineReducers } from '@reduxjs/toolkit';
import authReducer, * as authActions from './authSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
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
    | ReturnType<typeof authActions.logout>;
