import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { verifyEmailRequest,  verifyEmailSuccess, verifyEmailFailure } from '../slices/authSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { AuthAction } from '../types/authTypes.ts';
import type {RootState} from "../slices/rootReducer.ts";

const verifyEmailMutation = `
    mutation VerifyEmail($token: String!) { verifyEmail(token: $token) }`;

type VerifyEmailResponse = { verifyEmail: boolean };
type VerifyEmailRequestAction = ReturnType<typeof verifyEmailRequest>;

export const verifyEmailEpic: Epic<AuthAction, AuthAction, RootState> = action$ =>
    action$.pipe(
        ofType(verifyEmailRequest.type),
        mergeMap((action: VerifyEmailRequestAction) =>
            from( graphqlRequest<VerifyEmailResponse>(verifyEmailMutation, action.payload)).pipe(
                map(res => res.verifyEmail ? verifyEmailSuccess() : verifyEmailFailure("Verification failed")),
                catchError(err =>
                    of(verifyEmailFailure(err instanceof Error ? err.message : 'Verification failed'))
                )
            )
        )
    );