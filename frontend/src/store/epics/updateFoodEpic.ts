import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    updateFoodRequest,
    updateFoodSuccess,
    updateFoodFailure
} from '../slices/foodsSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const updateFoodMutation = `
  mutation UpdateFood(
    $foodId: Int!
    $userId: Int!
    $name: String
    $imageId: Int
    $calories: Decimal
    $protein: Decimal
    $fat: Decimal
    $carbohydrates: Decimal
  ) {
    updateFood(
      foodId: $foodId
      userId: $userId
      name: $name
      imageId: $imageId
      calories: $calories
      protein: $protein
      fat: $fat
      carbohydrates: $carbohydrates
    ) {
      id
      ownerId
      name
      imageId
      calories
      proteins
      fats
      carbs
      createdAt
      updatedAt
    }
  }
`;

type UpdateFoodResponse = {
    updateFood: {
        id: number;
        userId: number;
        name: string;
        imageId: number | null;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrates: number | null;
        createdAt: string;
        updatedAt: string;
    };
};

type UpdateFoodRequestAction = ReturnType<typeof updateFoodRequest>;

export const updateFoodEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(updateFoodRequest.type),

        mergeMap((action: UpdateFoodRequestAction) =>
            from(graphqlRequest<UpdateFoodResponse>(updateFoodMutation, action.payload)).pipe(
                map((res) =>
                    updateFoodSuccess({
                        ...res.updateFood,
                        createdAt: new Date(res.updateFood.createdAt),
                        updatedAt: new Date(res.updateFood.updatedAt),
                    })
                ),

                catchError((err) =>
                    of(
                        updateFoodFailure(
                            err instanceof Error ? err.message : 'Update food failed'
                        )
                    )
                )
            )
        )
    );
