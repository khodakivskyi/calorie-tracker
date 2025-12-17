import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import {
    getLimitRequest,
    getLimitSuccess,
    getLimitFailure
} from "../../slices/calorieLimitSlice";
import { graphqlRequest } from "../../../config/graphqlClient";
import type { RootEpicAction } from "../rootEpic";
import type { RootState } from "../../slices/rootReducer";
import type { CalorieLimit } from "../../types/calorieLimitTypes"

const getLimitQuery = `
  query GetCalorieLimit($ownerId: Int!) {
    getCalorieLimit(ownerId: $ownerId) {
      id          
      ownerId
      limitValue
      createdAt   
    }
  }
`;

type GetLimitResponse = {
    getCalorieLimit: CalorieLimit | null;
};

type GetLimitRequestAction = ReturnType<typeof getLimitRequest>;

export const getCalorieLimitEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(getLimitRequest.type),
        mergeMap((action: GetLimitRequestAction) =>
            from(
                graphqlRequest<GetLimitResponse>(getLimitQuery, {
                    ownerId: action.payload.ownerId
                })
            ).pipe(
                map((res) => getLimitSuccess(res.getCalorieLimit)),

                catchError((err) =>
                    of(
                        getLimitFailure(
                            err instanceof Error ? err.message : "Failed to load calorie limit"
                        )
                    )
                )
            )
        )
    );