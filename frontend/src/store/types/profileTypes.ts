import {
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
    clearSettingsMessages
} from '../slices/profileSlice.ts';

export type ProfileAction =
    | ReturnType<typeof updateProfileRequest>
    | ReturnType<typeof updateProfileSuccess>
    | ReturnType<typeof updateProfileFailure>
    | ReturnType<typeof clearSettingsMessages>;

