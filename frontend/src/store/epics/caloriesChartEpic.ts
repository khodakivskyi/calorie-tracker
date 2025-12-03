import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { graphqlRequest } from '../../config/graphqlClient';
import {
    fetchChartDataRequest,
    fetchChartDataSuccess,
    fetchChartDataFailure
} from '../slices/caloriesChartSlice';
import type { RootState } from "../slices/rootReducer";
import type { RootEpicAction } from './rootEpic';

const GET_WEEKLY_CALORIES = `
    query GetWeeklyCalories($userId: Int!, $startDate: Date!) {
        getWeeklyCalories(userId: $userId, startDate: $startDate) {
            date
            totalCalories
        }
    }
`;

const GET_MONTHLY_CALORIES = `
    query GetMonthlyCalories($userId: Int!, $year: Int!, $month: Int!) {
        getMonthlyCalories(userId: $userId, year: $year, month: $month) {
            date
            totalCalories
        }
    }
`;

const formatLabel = (dateString: string, period: 'Week' | 'Month') => {
    const date = new Date(dateString);
    if (period === 'Week') return date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`; // "1 Nov"
};

export const caloriesChartEpic: Epic<RootEpicAction, RootEpicAction, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fetchChartDataRequest.type),
        mergeMap((action) => {
            const userId = state$.value.auth.user?.id;
            const { period } = action.payload;

            if (!userId) return of(fetchChartDataFailure('User not authenticated'));

            const today = new Date();
            let query = '';
            let variables = {};

            if (period === 'Week') {
                query = GET_WEEKLY_CALORIES;
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 6);
                variables = { userId, startDate: lastWeek.toISOString() };
            } else if (period === 'Month') {
                query = GET_MONTHLY_CALORIES;
                variables = { userId, year: today.getFullYear(), month: today.getMonth() + 1 };
            } else {
                // in development
                return of(fetchChartDataSuccess([]));
            }

            return from(graphqlRequest<any>(query, variables)).pipe(
                map((response) => {
                    const rawData = response.getWeeklyCalories || response.getMonthlyCalories || [];

                    const formattedData = rawData.map((item: any) => ({
                        name: formatLabel(item.date, period),
                        calories: item.totalCalories
                    }));

                    return fetchChartDataSuccess(formattedData);
                }),
                catchError(err => of(fetchChartDataFailure(err.message)))
            );
        })
    );