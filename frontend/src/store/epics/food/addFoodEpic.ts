import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    createFoodRequest,
    createFoodSuccess,
    createFoodFailure
} from '../../slices/foodsSlice.ts';
import { graphqlRequest } from '../../../config/graphqlClient.ts';
import type { RootEpicAction } from '../rootEpic.ts';
import type { RootState } from '../../slices/rootReducer.ts';

const createFoodMutation = `
  mutation CreateFood(
  $ownerId: Int
  $name: String!
  $imageId: Int
  $calories: Decimal
  $protein: Decimal
  $fat: Decimal
  $carbohydrate: Decimal
) {
  createFood(
    ownerId: $ownerId
    name: $name
    imageId: $imageId
    calories: $calories
    protein: $protein
    fat: $fat
    carbohydrate: $carbohydrate
  ) {
    id
    ownerId
    name
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

type CreateFoodResponse = {
    createFood: {
        id: number;
        ownerId: number | null;
        name: string;
        imageId: number | null;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
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
                        createdAt: new Date(res.createFood.createdAt).toISOString(),
                        updatedAt: new Date(res.createFood.updatedAt).toISOString(),
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

