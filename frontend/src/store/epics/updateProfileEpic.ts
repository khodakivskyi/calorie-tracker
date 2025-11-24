import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, catchError} from 'rxjs/operators';
import {updateProfileRequest, updateProfileSuccess, updateProfileFailure} from '../slices/profileSlice.ts';
import {authenticateUserSuccess} from '../slices/authSlice';
import {graphqlRequest} from '../../config/graphqlClient';
import type {RootState} from "../slices/rootReducer.ts";
import type {RootEpicAction} from './rootEpic.ts';

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

export const updateProfileEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(updateProfileRequest.type),
        mergeMap((action: UpdateProfileRequestAction) => {
            const userId = state$.value.auth.user?.id;
            if (!userId) {
                return of(updateProfileFailure('User is not authenticated'));
            }

            const variables: { userId: number; name?: string | null; password?: string | null } = {userId};

            if (action.payload.name !== null) {
                variables.name = action.payload.name;
            }
            if (action.payload.password !== null) {
                variables.password = action.payload.password;
            }
            return from(
                graphqlRequest<UpdateUserResponse>(updateUserMutation, variables)
            ).pipe(
                mergeMap(res => [
                    updateProfileSuccess(),
                    authenticateUserSuccess({
                        accessToken: res.updateUser.accessToken,
                        user: res.updateUser.user,
                    }),
                ]),
                catchError(err =>
                    of(updateProfileFailure(err instanceof Error ? err.message : 'Failed to update profile'))
                )
            );
        })
    );


