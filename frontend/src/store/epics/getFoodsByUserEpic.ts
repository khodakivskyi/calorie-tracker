import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    getFoodsByUserRequest,
    getFoodsByUserSuccess,
    getFoodsByUserFailure
} from '../slices/foodsSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const getFoodsByUserQuery = `
  query GetFoodsByUser($userId: Int!) {
    getFoodsByUser(userId: $userId) {
      id
      name
      ownerId
      calories
      proteins
      fats
      carbs
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
        userId: number | null;
        calories: number | null;
        proteins: number | null;
        fats: number | null;
        carbs: number | null;
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
                    userId: action.payload.userId,
                })
            ).pipe(
                map((res) =>
                    getFoodsByUserSuccess(
                        res.getFoodsByUser.map((f) => ({
                            ...f,
                            createdAt: new Date(f.createdAt),
                            updatedAt: new Date(f.updatedAt),
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
