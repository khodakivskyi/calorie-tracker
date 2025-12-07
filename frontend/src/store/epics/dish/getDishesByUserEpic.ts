import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import {
    getDishesByUserRequest,
    getDishesByUserSuccess,
    getDishesByUserFailure
} from "../../slices/dishesSlice.ts";
import { graphqlRequest } from "../../../config/graphqlClient.ts";
import type { RootEpicAction } from "../rootEpic.ts";
import type { RootState } from "../../slices/rootReducer.ts";

const getDishesByUserQuery = `
  query GetDishesByUser($ownerId: Int!) {
    getDishesByUser(ownerId: $ownerId) {
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

type GetDishesByUserResponse = {
    getDishesByUser: {
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
    }[];
};

export const getDishesByUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getDishesByUserRequest.type),

        mergeMap((action: ReturnType<typeof getDishesByUserRequest>) =>
            from(
                graphqlRequest<GetDishesByUserResponse>(getDishesByUserQuery, {
                    ownerId: action.payload.ownerId
                })
            ).pipe(
                map((res) =>
                    getDishesByUserSuccess(
                        res.getDishesByUser.map((dish) => ({
                            ...dish,
                            createdAt: new Date(dish.createdAt).toISOString(),
                            updatedAt: new Date(dish.updatedAt).toISOString(),
                        }))
                    )
                ),

                catchError((err) =>
                    of(
                        getDishesByUserFailure(
                            err instanceof Error ? err.message : "Failed to load dishes"
                        )
                    )
                )
            )
        )
    );
