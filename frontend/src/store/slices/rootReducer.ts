import { combineReducers } from '@reduxjs/toolkit';
import authReducer, * as authActions from './authSlice';
import profileReducer, * as profileActions from './profileSlice.ts';

export const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
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
    | ReturnType<typeof profileActions.clearSettingsMessages>;
