import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    updateDishRequest,
    updateDishSuccess,
    updateDishFailure,
} from '../slices/dishesSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const updateDishMutation = `
  mutation UpdateDish(
    $dishId: Int!
    $userId: Int!
    $weight: Decimal
    $name: String
  ) {
    updateDish(
      dishId: $dishId
      userId: $userId
      weight: $weight
      name: $name
    ) {
      id
      name
      ownerId
      weight
      imageId
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
                        createdAt: new Date(res.updateDish.createdAt),
                        updatedAt: new Date(res.updateDish.updatedAt),
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
