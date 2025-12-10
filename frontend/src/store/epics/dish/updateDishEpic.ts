import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    updateDishRequest,
    updateDishSuccess,
    updateDishFailure,
} from '../../slices/dishesSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const updateDishMutation = `
  mutation UpdateDish(
    $dishId: Int!
    $ownerId: Int!
    $weight: Decimal
    $name: String
  ) {
    updateDish(
      dishId: $dishId
      ownerId: $ownerId
      weight: $weight
      name: $name
    ) {
      id
      name
      ownerId
      weight
      imageId
      calories
      protein
      fat
      carbohydrate
      createdAt
      updatedAt
    }
  }
`;

type UpdateDishResponse = {
    updateDish: {
        id: number;
        name: string;
        ownerId: number | null;
        weight: number;
        imageId: number | null;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
        createdAt: string;
        updatedAt: string;
    };
};

type UpdateDishRequestAction = ReturnType<typeof updateDishRequest>;

export const updateDishEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(updateDishRequest.type),

        mergeMap((action: UpdateDishRequestAction) =>
            from(graphqlRequest<UpdateDishResponse>(updateDishMutation, action.payload)).pipe(
                map((res) =>
                    updateDishSuccess({
                        ...res.updateDish,
                        createdAt: new Date(res.updateDish.createdAt).toISOString(),
                        updatedAt: new Date(res.updateDish.updatedAt).toISOString(),
                    })
                ),

                catchError((err) =>
                    of(
                        updateDishFailure(
                            err instanceof Error ? err.message : 'Update dish failed'
                        )
                    )
                )
            )
        )
    );
