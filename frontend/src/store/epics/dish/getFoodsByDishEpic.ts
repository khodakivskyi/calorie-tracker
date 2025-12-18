import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import {
    getFoodsByDishRequest,
    getFoodsByDishSuccess,
    getFoodsByDishFailure
} from "../../slices/dishesSlice.ts";
import { graphqlRequest } from "../../../config/graphqlClient.ts";
import type { RootEpicAction } from "../rootEpic.ts";
import type { RootState } from "../../slices/rootReducer.ts";

const getFoodsByDishQuery = `
  query GetFoodsByDish($ownerId: Int!, $dishId: Int!) {
    getFoodsByDish(ownerId: $ownerId, dishId: $dishId) {
      id
      name
      weight
      calories
      protein
      fat
      carbohydrate
    }
  }
`;

type GetFoodsByDishResponse = {
    getFoodsByDish: {
        id: number;
        name: string;
        weight: number;
        calories: number;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
    }[];
};

export const getFoodsByDishEpic: Epic<
    RootEpicAction,
    RootEpicAction,
    RootState
> = (action$) =>
    action$.pipe(
        ofType(getFoodsByDishRequest.type),

        mergeMap((action: ReturnType<typeof getFoodsByDishRequest>) =>
            from(
                graphqlRequest<GetFoodsByDishResponse>(getFoodsByDishQuery, {
                    ownerId: action.payload.ownerId,
                    dishId: action.payload.dishId,
                })
            ).pipe(
                map((res) =>
                    getFoodsByDishSuccess({
                        dishId: action.payload.dishId,
                        foods: res.getFoodsByDish,
                    })
                ),

                catchError((err) =>
                    of(
                        getFoodsByDishFailure(
                            err instanceof Error
                                ? err.message
                                : "Failed to load foods by dish"
                        )
                    )
                )
            )
        )
    );
