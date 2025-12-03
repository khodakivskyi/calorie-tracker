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
    query GetMonthlyCaloriesForHeatmap($userId: Int!, $year: Int!, $month: Int!) {
        getMonthlyCalories(userId: $userId, year: $year, month: $month) {
            date
            totalCalories
        }
    }
`;

export const activityHeatmapEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fetchHeatmapRequest.type),
        mergeMap(() => {
            const userId = state$.value.auth.user?.id;
            if (!userId) return of(fetchHeatmapFailure('User not authenticated'));

            const today = new Date();
            const variables = {
                userId,
                year: today.getFullYear(),
                month: today.getMonth() + 1
            };

            return from(graphqlRequest<any>(GET_MONTHLY_CALORIES, variables)).pipe(
                map((response) => {
                    const rawData = response.getMonthlyCalories || [];

                    const formattedLogs = rawData.map((item: any) => {
                        const dateObj = new Date(item.date);
                        const dateString = dateObj.toISOString().split('T')[0];

                        return {
                            date: dateString,
                            calories: item.totalCalories
                        };
                    });

                    return fetchHeatmapSuccess(formattedLogs);
                }),
                catchError(err => of(fetchHeatmapFailure(err.message)))
            );
        })
    );