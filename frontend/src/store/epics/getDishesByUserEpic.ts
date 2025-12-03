import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";

import {
    getDishesByUserRequest,
    getDishesByUserSuccess,
    getDishesByUserFailure
} from "../slices/dishesSlice";

import { graphqlRequest } from "../../config/graphqlClient";
import type { RootEpicAction } from "./rootEpic";
import type { RootState } from "../slices/rootReducer";
import type { Dish } from "../types/dishTypes";

const getDishesByUserQuery = `
  query GetDishesByUser($userId: Int!) {
    getDishesByUser(userId: $userId) {
      id
      name
      ownerId
      weight
      imageId
      createdAt
      updatedAt
      foods {
        foodId
        quantity
        food {
          id
          name
          userId
          calories
          protein
          fat
          carbohydrates
          imageId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

type GetDishesResponse = {
    getDishesByUser: Array<{
        id: number;
        name: string;
        ownerId: number | null;
        weight: number;
        imageId: number | null;
        createdAt: string;
        updatedAt: string;
        foods?: Array<{
            foodId: number;
            quantity: number;
            food?: {
                id: number;
                name: string;
                userId: number | null;
                calories: number | null;
                protein: number | null;
                fat: number | null;
                carbohydrates: number | null;
                imageId: number | null;
                createdAt: string;
                updatedAt: string;
            };
        }>;
    }>;
};

export const getDishesByUserEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getDishesByUserRequest.type),

        mergeMap((action: ReturnType<typeof getDishesByUserRequest>) =>
            from(
                graphqlRequest<GetDishesResponse>(getDishesByUserQuery, {
                    userId: action.payload.userId
                })
            ).pipe(
                map((res) =>
                    getDishesByUserSuccess(
                        res.getDishesByUser.map((dish) => ({
                            ...dish,
                            createdAt: new Date(dish.createdAt),
                            updatedAt: new Date(dish.updatedAt),

                            foods:
                                dish.foods?.map((df) => ({
                                    ...df,
                                    food: df.food
                                        ? {
                                            ...df.food,
                                            createdAt: new Date(df.food.createdAt),
                                            updatedAt: new Date(df.food.updatedAt)
                                        }
                                        : undefined
                                })) ?? []
                        })) as Dish[]
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
