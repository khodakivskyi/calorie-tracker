import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    deleteFoodRequest,
    deleteFoodSuccess,
    deleteFoodFailure
} from '../slices/foodsSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const deleteFoodMutation = `
  mutation DeleteFood($foodId: Int!, $userId: Int!) {
    deleteFood(foodId: $foodId, userId: $userId)
  }
`;

type DeleteFoodResponse = {
    deleteFood: boolean;
};

type DeleteFoodRequestAction = ReturnType<typeof deleteFoodRequest>;


export const deleteFoodEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(deleteFoodRequest.type),

        mergeMap((action: DeleteFoodRequestAction) =>
            from(
                graphqlRequest<DeleteFoodResponse>(deleteFoodMutation, action.payload)
            ).pipe(
                map((res) => {
                    if (res.deleteFood) {
                        return deleteFoodSuccess({ foodId: action.payload.foodId });
                    }
                    return deleteFoodFailure("Delete failed");
                }),

                catchError((err) =>
                    of(
                        deleteFoodFailure(
                            err instanceof Error ? err.message : 'Delete food failed'
                        )
                    )
                )
            )
        )
    );
