import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { verifyEmailRequest,  verifyEmailSuccess, verifyEmailFailure } from '../slices/authSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic.ts';
import type {RootState} from "../slices/rootReducer.ts";

const verifyEmailMutation = `
    mutation VerifyEmail($token: String!) { verifyEmail(token: $token) }`;

type VerifyEmailResponse = { verifyEmail: boolean | null };
type VerifyEmailRequestAction = ReturnType<typeof verifyEmailRequest>;

export const verifyEmailEpic: Epic<RootEpicAction, RootEpicAction, RootState> = action$ =>
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