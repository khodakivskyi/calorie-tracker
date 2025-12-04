import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    createFoodRequest,
    createFoodSuccess,
    createFoodFailure
} from '../slices/foodsSlice';
import { graphqlRequest } from '../../config/graphqlClient';
import type { RootEpicAction } from './rootEpic';
import type { RootState } from '../slices/rootReducer';

const createFoodMutation = `
  mutation CreateFood(
  $userId: Int
  $name: String!
  $imageId: Int
  $calories: Decimal
  $protein: Decimal
  $fat: Decimal
  $carbohydrates: Decimal
) {
  createFood(
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

type CreateFoodResponse = {
    createFood: {
        id: number;
        userId: number | null;
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

type CreateFoodRequestAction = ReturnType<typeof createFoodRequest>;

export const createFoodEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(createFoodRequest.type),

        mergeMap((action: CreateFoodRequestAction) =>
            from(graphqlRequest<CreateFoodResponse>(createFoodMutation, action.payload)).pipe(
                map((res) =>
                    createFoodSuccess({
                        ...res.createFood,
                        createdAt: new Date(res.createFood.createdAt),
                        updatedAt: new Date(res.createFood.updatedAt),
                    })
                ),

                catchError((err) =>
                    of(
                        createFoodFailure(
                            err instanceof Error ? err.message : 'Create food failed'
                        )
                    )
                )
            )
        )
    );

