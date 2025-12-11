import {
    getLimitFailure,
    getLimitRequest,
    getLimitSuccess, removeLimitFailure, removeLimitRequest, removeLimitSuccess, setLimitFailure,
    setLimitRequest,
    setLimitSuccess
} from "../slices/calorieLimitSlice.ts";

export type CalorieLimit = {
    id: number;
    ownerId: number;
    limitValue: number;
    createdAt: string;
};

export type CalorieLimitAction =
    | ReturnType<typeof getLimitRequest>
    | ReturnType<typeof getLimitSuccess>
    | ReturnType<typeof getLimitFailure>
    | ReturnType<typeof setLimitRequest>
    | ReturnType<typeof setLimitSuccess>
    | ReturnType<typeof setLimitFailure>
    | ReturnType<typeof removeLimitRequest>
    | ReturnType<typeof removeLimitSuccess>
    | ReturnType<typeof removeLimitFailure>;