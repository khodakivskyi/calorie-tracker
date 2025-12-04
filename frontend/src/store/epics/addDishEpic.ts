import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    createDishRequest,
    createDishSuccess,
    createDishFailure,
} from '../slices/dishesSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const createDishMutation = `
  mutation CreateDish(
    $userId: Int
    $weight: Decimal!
    $name: String!
  ) {
    createDish(
      userId: $userId
      weight: $weight
      name: $name
    ) {
      id
      name
      ownerId
      weight
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

type CreateDishResponse = {
    createDish: {
        id: number;
        name: string;
        ownerId: number | null;
        weight: number;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
        imageId: number | null;
        createdAt: string;
        updatedAt: string;
    };
};

type CreateDishRequestAction = ReturnType<typeof createDishRequest>;

export const createDishEpic: Epic<
    RootEpicAction,
    RootEpicAction,
    RootState
> = (action$) =>
    action$.pipe(
        ofType(createDishRequest.type),

        mergeMap((action: CreateDishRequestAction) =>
            from(
                graphqlRequest<CreateDishResponse>(
                    createDishMutation,
                    action.payload
                )
            ).pipe(
                map((res) =>
                    createDishSuccess({
                        ...res.createDish,
                        createdAt: new Date(res.createDish.createdAt),
                        updatedAt: new Date(res.createDish.updatedAt),
                    })
                ),

                catchError((err) =>
                    of(
                        createDishFailure(
                            err instanceof Error
                                ? err.message
                                : 'Create dish failed'
                        )
                    )
                )
            )
        )
    );
