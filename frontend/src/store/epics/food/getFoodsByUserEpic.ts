import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    getFoodsByUserRequest,
    getFoodsByUserSuccess,
    getFoodsByUserFailure
} from '../../slices/foodsSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const getFoodsByUserQuery = `
  query GetFoodsByUser($ownerId: Int!) {
    getFoodsByUser(ownerId: $ownerId) {
      id
      name
      ownerId
      calories
      protein
      fat
      carbohydrate
      imageId
      createdAt
      updatedAt
    }
  }
`;

type GetFoodsByUserResponse = {
    getFoodsByUser: {
        id: number;
        name: string;
        ownerId: number | null;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
        imageId: number | null;
        createdAt: string;
        updatedAt: string;
    }[];
};

type GetFoodsByUserRequestAction = ReturnType<typeof getFoodsByUserRequest>;

export const getFoodsByUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getFoodsByUserRequest.type),

        mergeMap((action: GetFoodsByUserRequestAction) =>
            from(
                graphqlRequest<GetFoodsByUserResponse>(getFoodsByUserQuery, {
                    ownerId: action.payload.ownerId,
                })
            ).pipe(
                map((res) =>
                    getFoodsByUserSuccess(
                        res.getFoodsByUser.map((f) => ({
                            ...f,
                            createdAt: new Date(f.createdAt).toISOString(),
                            updatedAt: new Date(f.updatedAt).toISOString(),
                        }))
                    )
                ),

                catchError((err) =>
                    of(
                        getFoodsByUserFailure(
                            err instanceof Error ? err.message : 'Failed to load foods'
                        )
                    )
                )
            )
        )
    );
