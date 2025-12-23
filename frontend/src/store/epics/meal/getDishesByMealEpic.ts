import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    getDishesByMealRequest,
    getDishesByMealSuccess,
    getDishesByMealFailure
} from '../../slices/mealSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const getDishesByMealQuery = `
  query GetDishesByMeal($mealId: Int!) {
    getDishesByMeal(mealId: $mealId) {
      dishId
      weight
    }
  }
`;

type GetDishesByMealResponse = {
    getDishesByMeal: {
        dishId: number;
        weight: number;
    }[];
};

type GetDishesByMealRequestAction = ReturnType<typeof getDishesByMealRequest>;

export const getDishesByMealEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getDishesByMealRequest.type),

        mergeMap((action: GetDishesByMealRequestAction) =>
            from(
                graphqlRequest<GetDishesByMealResponse>(getDishesByMealQuery, {
                    mealId: action.payload.mealId
                })
            ).pipe(
                map((res) =>
                    getDishesByMealSuccess({
                        mealId: action.payload.mealId,
                        dishes: res.getDishesByMeal
                    })
                ),

                catchError((err) =>
                    of(
                        getDishesByMealFailure(
                            err instanceof Error ? err.message : 'Failed to load dishes'
                        )
                    )
                )
            )
        )
    );
