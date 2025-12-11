import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import {
    setLimitRequest,
    setLimitSuccess,
    setLimitFailure
} from "../../slices/calorieLimitSlice";
import { graphqlRequest } from "../../../config/graphqlClient";
import type { RootEpicAction } from "../rootEpic";
import type { RootState } from "../../slices/rootReducer";

const setLimitMutation = `
  mutation SetCalorieLimit($ownerId: Int!, $limitValue: Decimal!) {
    setCalorieLimit(ownerId: $ownerId, limitValue: $limitValue) {
      id
      ownerId
      limitValue
      createdAt
    }
  }
`;

type SetLimitResponse = {
    setCalorieLimit: {
        id: number;
        ownerId: number;
        limitValue: number;
        createdAt: string;
    };
};

export const setCalorieLimitEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$) =>
    action$.pipe(
        ofType(setLimitRequest.type),
        mergeMap((action: ReturnType<typeof setLimitRequest>) =>
            from(graphqlRequest<SetLimitResponse>(setLimitMutation, action.payload)).pipe(
                map((res) =>
                    setLimitSuccess({
                        ...res.setCalorieLimit,
                        createdAt: new Date(res.setCalorieLimit.createdAt).toISOString()
                    })
                ),
                catchError((err) =>
                    of(setLimitFailure(err instanceof Error ? err.message : "Set limit failed"))
                )
            )
        )
    );
