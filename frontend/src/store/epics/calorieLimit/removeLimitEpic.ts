import { type Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import {
    removeLimitRequest,
    removeLimitSuccess,
    removeLimitFailure
} from "../../slices/calorieLimitSlice";
import { graphqlRequest } from "../../../config/graphqlClient";
import type { RootEpicAction } from "../rootEpic";
import type { RootState } from "../../slices/rootReducer";

const removeLimitMutation = `
  mutation RemoveCalorieLimit($ownerId: Int!) {
    removeCalorieLimit(ownerId: $ownerId)
  }
`;

type RemoveResponse = {
    removeCalorieLimit: boolean;
};

type RemoveAction = ReturnType<typeof removeLimitRequest>;

export const removeCalorieLimitEpic: Epic<
    RootEpicAction,
    RootEpicAction,
    RootState
> = (action$) =>
    action$.pipe(
        ofType(removeLimitRequest.type),
        mergeMap((action: RemoveAction) =>
            from(
                graphqlRequest<RemoveResponse>(removeLimitMutation, action.payload)
            ).pipe(
                map((res) =>
                    res.removeCalorieLimit
                        ? removeLimitSuccess()
                        : removeLimitFailure("Failed to remove calorie limit")
                ),
                catchError((err) =>
                    of(
                        removeLimitFailure(
                            err instanceof Error ? err.message : "Remove calorie limit failed"
                        )
                    )
                )
            )
        )
    );
