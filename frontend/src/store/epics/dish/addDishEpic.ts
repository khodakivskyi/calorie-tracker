import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    createDishRequest,
    createDishSuccess,
    createDishFailure,
} from '../../slices/dishesSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const createDishMutation = `
  mutation CreateDish(
    $ownerId: Int
    $weight: Decimal!
    $name: String!
  ) {
    createDish(
      ownerId: $ownerId
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
                        createdAt: new Date(res.createDish.createdAt).toISOString(),
                        updatedAt: new Date(res.createDish.updatedAt).toISOString(),
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
