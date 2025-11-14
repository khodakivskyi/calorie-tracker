import {
    registerUserRequest,
    registerUserSuccess,
    registerUserFailure,
    authenticateUserRequest,
    authenticateUserSuccess,
    authenticateUserFailure,
    verifyEmailRequest,
    verifyEmailSuccess,
    verifyEmailFailure,
    setAccessToken,
    logout
} from '../slices/authSlice.ts';

export type AuthAction =
    | ReturnType<typeof registerUserRequest>
    | ReturnType<typeof registerUserSuccess>
    | ReturnType<typeof registerUserFailure>
    | ReturnType<typeof authenticateUserRequest>
    | ReturnType<typeof authenticateUserSuccess>
    | ReturnType<typeof authenticateUserFailure>
    | ReturnType<typeof verifyEmailRequest>
    | ReturnType<typeof verifyEmailSuccess>
    | ReturnType<typeof verifyEmailFailure>
    | ReturnType<typeof setAccessToken>
    | ReturnType<typeof logout>;

