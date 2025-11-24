import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {createMealRequest, createMealSuccess, createMealFailure} from '../slices/mealSlice';
import {graphqlRequest} from '../../config/graphqlClient';
import type {RootEpicAction} from './rootEpic.ts';
import type {RootState} from "../slices/rootReducer.ts";

const createMealMutation = `
    mutation CreateMeal($userId: Int!, $typeId: Int!, $name: String!) {
        createMeal(userId: $userId, typeId: $typeId, name: $name) {
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
                    createdAt: new Date(res.createMeal.createdAt),
                    updatedAt: new Date(res.createMeal.updatedAt)
                })),
                catchError(err =>
                    of(createMealFailure(err instanceof Error ? err.message : 'Authentication failed'))
                )
            )
        )
    );