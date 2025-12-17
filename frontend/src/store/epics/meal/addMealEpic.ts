import {type Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {createMealRequest, createMealSuccess, createMealFailure} from '../../slices/mealSlice.ts';
import {graphqlRequest} from '../../../config/graphqlClient.ts';
import type {RootEpicAction} from '../rootEpic.ts';
import type {RootState} from "../../slices/rootReducer.ts";

const createMealMutation = `
    mutation CreateMeal($input: CreateMealInput!) {
        createMeal(input: $input) {
            id
            ownerId
            typeId
            name
            calories
            protein
            carbohydrate
            fat
            createdAt
            updatedAt
        }
    }
`;

type CreateMealResponse = {
    createMeal: {
        id: number;
        ownerId: number;
        typeId: number;
        name: string;
        calories: number | null;
        protein: number | null;
        carbohydrate: number | null;
        fat: number | null;
        createdAt: string;
        updatedAt: string;
    };
};

type CreateMealRequestAction = ReturnType<typeof createMealRequest>;

export const addMealEpic: Epic<RootEpicAction, RootEpicAction, RootState> = action$ =>
    action$.pipe(
        ofType(createMealRequest.type),
        mergeMap((action: CreateMealRequestAction) =>
            from(graphqlRequest<CreateMealResponse>(createMealMutation, {input: action.payload})).pipe(
                map(res => createMealSuccess({
                    ...res.createMeal,
                    createdAt: new Date(res.createMeal.createdAt).toISOString(),
                    updatedAt: new Date(res.createMeal.updatedAt).toISOString(),
                })),
                catchError(err =>
                    of(createMealFailure(err instanceof Error ? err.message : 'Meal creation failed'))
                )
            )
        )
    );