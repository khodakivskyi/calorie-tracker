import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    deleteDishRequest,
    deleteDishSuccess,
    deleteDishFailure
} from '../slices/dishesSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const deleteDishMutation = `
  mutation DeleteDish($dishId: Int!, $ownerId: Int!) {
    deleteDish(dishId: $dishId, ownerId: $ownerId)
  }
`;

type DeleteDishResponse = {
    deleteDish: boolean;
};

type DeleteDishRequestAction = ReturnType<typeof deleteDishRequest>;


export const deleteDishEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(deleteDishRequest.type),

        mergeMap((action: DeleteDishRequestAction) =>
            from(
                graphqlRequest<DeleteDishResponse>(deleteDishMutation, action.payload)
            ).pipe(
                map((res) => {
                    if (res.deleteDish) {
                        return deleteDishSuccess({ dishId: action.payload.dishId });
                    }
                    return deleteDishFailure("Delete dish failed");
                }),

                catchError((err) =>
                    of(
                        deleteDishFailure(
                            err instanceof Error ? err.message : "Delete dish failed"
                        )
                    )
                )
            )
        )
    );
