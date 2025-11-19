import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, catchError} from 'rxjs/operators';
import {updateProfileRequest, updateProfileSuccess, updateProfileFailure} from '../slices/settingsSlice';
import {authenticateUserSuccess} from '../slices/authSlice';
import {graphqlRequest} from '../../config/graphqlClient';
import type {RootState} from "../slices/rootReducer.ts";
import type {SettingsAction} from '../types/settingsTypes';
import type {AuthAction} from '../types/authTypes.ts';

const updateUserMutation = `
    mutation UpdateUser($userId: Int!, $name: String, $password: String) {
        updateUser(userId: $userId, name: $name, password: $password) {
            user { id email name }
            accessToken
        }
    }
`;

type UpdateUserResponse = {
    updateUser: { user: { id: number; email: string; name: string | null }; accessToken: string; };
};

type UpdateProfileRequestAction = ReturnType<typeof updateProfileRequest>;
type SettingsEpicAction = SettingsAction | AuthAction;

export const updateProfileEpic: Epic<SettingsEpicAction, SettingsEpicAction, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(updateProfileRequest.type),
        mergeMap((action: UpdateProfileRequestAction) => {
            const userId = state$.value.auth.user?.id;
            if (!userId) {
                return of(updateProfileFailure('Користувач не автентифікований'));
            }

            return from(
                graphqlRequest<UpdateUserResponse>(updateUserMutation, {
                    userId,
                    name: action.payload.name,
                    password: action.payload.password,
                })
            ).pipe(
                mergeMap(res => [
                    updateProfileSuccess(),
                    authenticateUserSuccess({
                        accessToken: res.updateUser.accessToken,
                        user: res.updateUser.user,
                    }),
                ]),
                catchError(err =>
                    of(updateProfileFailure(err instanceof Error ? err.message : 'Помилка оновлення профілю'))
                )
            );
        })
    );


