import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    getMealsByUserRequest,
    getMealsByUserSuccess,
    getMealsByUserFailure
} from '../../slices/mealSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const getMealsByUserQuery = `
  query GetMealsByUser($ownerId: Int!) {
    getMealsByUser(ownerId: $ownerId) {
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

type GetMealsByUserResponse = {
    getMealsByUser: {
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
    }[];
};

type GetMealsByUserRequestAction = ReturnType<typeof getMealsByUserRequest>;

export const getMealsByUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getMealsByUserRequest.type),

        mergeMap((action: GetMealsByUserRequestAction) =>
            from(
                graphqlRequest<GetMealsByUserResponse>(getMealsByUserQuery, {
                    ownerId: action.payload.ownerId
                })
            ).pipe(
                map((res) =>
                    getMealsByUserSuccess(
                        res.getMealsByUser.map((m) => ({
                            ...m,
                            createdAt: new Date(m.createdAt).toISOString(),
                            updatedAt: new Date(m.updatedAt).toISOString()
                        }))
                    )
                ),

                catchError((err) =>
                    of(
                        getMealsByUserFailure(
                            err instanceof Error ? err.message : 'Failed to load meals'
                        )
                    )
                )
            )
        )
    );
