import {
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
    clearSettingsMessages
} from '../slices/settingsSlice.ts';

export type SettingsAction =
    | ReturnType<typeof updateProfileRequest>
    | ReturnType<typeof updateProfileSuccess>
    | ReturnType<typeof updateProfileFailure>
    | ReturnType<typeof clearSettingsMessages>;

