import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { registerUserRequest,  registerUserSuccess, registerUserFailure } from '../slices/authSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type {RootEpicAction} from './rootEpic.ts'
import type {RootState} from "../slices/rootReducer.ts";

const registerUserMutation = `
  mutation CreateUser($email: String!, $password: String!, $name: String) {
    createUser(email: $email, password: $password, name: $name) {
      user { id email name }
    }
  }
`;

type RegisterResponse = { createUser: { user: {id: number; email: string, name: string | null}; } }
type RegisterUserRequestAction = ReturnType<typeof registerUserRequest>;

export const registerUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = action$ =>
    action$.pipe(
        ofType(registerUserRequest.type),
        mergeMap((action: RegisterUserRequestAction) =>
            from( graphqlRequest<RegisterResponse>(registerUserMutation, action.payload)).pipe(
                map(res => registerUserSuccess(res.createUser.user.email)),
                catchError(err =>
                    of(registerUserFailure(err instanceof Error ? err.message : 'Registration failed'))
                )
            )
        )
    );