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

const getLimitQuery = `
  query GetCalorieLimit($ownerId: Int!) {
    getCalorieLimit(ownerId: $ownerId) {
      ownerId
      limitValue
    }
  }
`;

type GetLimitResponse = {
    getCalorieLimit: {
        ownerId: number;
        limitValue: number;
    } | null;
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
                map((res) =>
                    getLimitSuccess(
                        res.getCalorieLimit.map
                            ? {
                                ownerId: res.getCalorieLimit.ownerId,
                                limitValue: res.getCalorieLimit.limitValue
                            }
                            : null
                    )
                ),
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
