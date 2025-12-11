import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { graphqlRequest } from '../../config/graphqlClient';
import {
    fetchHeatmapRequest,
    fetchHeatmapSuccess,
    fetchHeatmapFailure
} from '../slices/activityHeatmapSlice';
import type { RootState } from "../slices/rootReducer";
import type { RootEpicAction } from './rootEpic';

const GET_MONTHLY_CALORIES = `
    query GetMonthlyCaloriesForHeatmap($ownerId: Int!, $year: Int!, $month: Int!) {
        getMonthlyCalories(ownerId: $ownerId, year: $year, month: $month) {
            date
            totalCalories
        }
    }
`;

interface GraphQLResponse {
    getMonthlyCalories?: Array<{
        date: string;
        totalCalories: number;
    }>;
}

interface MonthlyCaloriesItem {
    date: string;
    totalCalories: number;
}

export const activityHeatmapEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fetchHeatmapRequest.type),
        mergeMap(() => {
            const userId = state$.value.auth.user?.id;
            if (!userId) return of(fetchHeatmapFailure('User not authenticated'));

            const today = new Date();
            const variables = {
                ownerId: userId,
                year: today.getFullYear(),
                month: today.getMonth() + 1
            };

            return from(graphqlRequest<GraphQLResponse>(GET_MONTHLY_CALORIES, variables)).pipe(
                map((response) => {
                    const rawData = response.getMonthlyCalories || [];

                    const formattedLogs = rawData.map((item: MonthlyCaloriesItem) => {
                        const dateString = item.date;

                        return {
                            date: dateString,
                            calories: Math.round(item.totalCalories)
                        };
                    });

                    return fetchHeatmapSuccess(formattedLogs);
                }),
                catchError(err => of(fetchHeatmapFailure(err.message)))
            );
        })
    );