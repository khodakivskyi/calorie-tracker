import { type Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { graphqlRequest } from '../../config/graphqlClient';
import {
    fetchChartDataRequest,
    fetchChartDataSuccess,
    fetchChartDataFailure,
    type ChartPeriod
} from '../slices/caloriesChartSlice';
import type { RootState } from "../slices/rootReducer";
import type { RootEpicAction } from './rootEpic';

const GET_WEEKLY_CALORIES = `
    query GetWeeklyCalories($ownerId: Int!, $startDate: Date!) {
        getWeeklyCalories(ownerId: $ownerId, startDate: $startDate) {
            date
            totalCalories
        }
    }
`;

const GET_MONTHLY_CALORIES = `
    query GetMonthlyCalories($ownerId: Int!, $year: Int!, $month: Int!) {
        getMonthlyCalories(ownerId: $ownerId, year: $year, month: $month) {
            date
            totalCalories
        }
    }
`;

const formatLabel = (dateString: string, period: ChartPeriod) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (period === 'Week') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.getDate().toString();
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

                const currentDay = today.getDay();
                const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

                const lastMonday = new Date(today);
                lastMonday.setDate(today.getDate() - distanceToMonday);

                const startDateStr = lastMonday.toISOString().split('T')[0];
                variables = { ownerId: userId, startDate: startDateStr };

            } else {
                query = GET_MONTHLY_CALORIES;
                variables = {
                    ownerId: userId,
                    year: today.getFullYear(),
                    month: today.getMonth() + 1
                };
            }

            return from(graphqlRequest<any>(query, variables)).pipe(
                map((response) => {
                    const rawData = response.getWeeklyCalories || response.getMonthlyCalories || [];

                    const formattedData = rawData.map((item: any) => ({
                        name: formatLabel(item.date, period),
                        calories: Math.round(item.totalCalories),
                        fullDate: item.date
                    }));

                    return fetchChartDataSuccess(formattedData);
                }),
                catchError(err => of(fetchChartDataFailure(err.message)))
            );
        })
    );