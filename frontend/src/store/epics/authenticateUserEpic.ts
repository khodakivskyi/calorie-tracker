import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {authenticateUserRequest, authenticateUserSuccess, authenticateUserFailure} from '../slices/authSlice';
import {graphqlRequest} from '../../config/graphqlClient';
import type {RootEpicAction} from './rootEpic.ts';
import type {RootState} from "../slices/rootReducer.ts";

const authenticateUserQuery = `
    query AuthenticateUser($email: String!, $password: String!) {
                    authenticateUser(email: $email, password: $password) {
                        user { id email name }
                        accessToken
                    }
                }
`;

type AuthenticateResponse = {
    authenticateUser: { user: { id: number; email: string, name: string | null }; accessToken: string; }
}
type AuthenticateUserRequestAction = ReturnType<typeof authenticateUserRequest>;

export const authenticateUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = action$ =>
    action$.pipe(
        ofType(authenticateUserRequest.type),
        mergeMap((action: AuthenticateUserRequestAction) =>
            from(graphqlRequest<AuthenticateResponse>(authenticateUserQuery, action.payload)).pipe(
                map(res => authenticateUserSuccess({
                    accessToken: res.authenticateUser.accessToken,
                    user: res.authenticateUser.user})),
                catchError(err =>
                    of(authenticateUserFailure(err instanceof Error ? err.message : 'Authentication failed'))
                )
            )
        )
    );