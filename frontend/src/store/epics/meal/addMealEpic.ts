import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {createMealRequest, createMealSuccess, createMealFailure} from '../../slices/mealSlice.ts';
import {graphqlRequest} from '../../../config/graphqlClient.ts';
import type {RootEpicAction} from '../rootEpic.ts';
import type {RootState} from "../../slices/rootReducer.ts";

const createMealMutation = `
    mutation CreateMeal($ownerId: Int!, $typeId: Int!, $name: String!) {
        createMeal(ownerId: $ownerId, typeId: $typeId, name: $name) {
            id
            ownerId
            name
            createdAt
            updatedAt
        }
    }
`;

type CreateMealResponse = {
    createMeal: {
        id: number;
        ownerId: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
};

type CreateMealRequestAction = ReturnType<typeof createMealRequest>;

export const addMealEpic: Epic<RootEpicAction, RootEpicAction, RootState> = action$ =>
    action$.pipe(
        ofType(createMealRequest.type),
        mergeMap((action: CreateMealRequestAction) =>
            from(graphqlRequest<CreateMealResponse>(createMealMutation, action.payload)).pipe(
                map(res => createMealSuccess({
                    ...res.createMeal,
                    createdAt: new Date(res.createMeal.createdAt).toISOString(),
                    updatedAt: new Date(res.createMeal.updatedAt).toISOString(),
                })),
                catchError(err =>
                    of(createMealFailure(err instanceof Error ? err.message : 'Authentication failed'))
                )
            )
        )
    );