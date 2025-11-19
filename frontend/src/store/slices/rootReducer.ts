import { combineReducers } from '@reduxjs/toolkit';
import authReducer, * as authActions from './authSlice';
import settingsReducer, * as settingsActions from './settingsSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer,
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
    | ReturnType<typeof settingsActions.updateProfileRequest>
    | ReturnType<typeof settingsActions.updateProfileSuccess>
    | ReturnType<typeof settingsActions.updateProfileFailure>
    | ReturnType<typeof settingsActions.clearSettingsMessages>;
