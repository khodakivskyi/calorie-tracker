import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { getLimitRequest } from "../store/slices/calorieLimitSlice";
import EditIcon from "../assets/icons/edit.svg?react";

interface CircularProgressProps {
    value: number;
    max: number;
    color: string;
    size?: number;
}

function CircularProgress({ value, max, color, size = 35 }: CircularProgressProps) {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    style={{ color }}
                />
            </svg>
        </div>
    );
}

interface NutrientCardProps {
    label: string;
    value: number;
    color: string;
    progressValue: number;
    progressMax: number;
}

function NutrientCard({ label, value, color, progressValue, progressMax }: NutrientCardProps) {
    return (
        <div className="bg-white rounded-2xl p-4 flex items-center gap-2 border border-gray-100">
            <CircularProgress value={progressValue} max={progressMax} color={color} />
            <div className="flex flex-col">
                <span className="text-sm font-medium" style={{ color }}>{label}</span>
                <span className="text-xl font-semibold" style={{ color }}>
                    {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                    <span className="text-base font-normal">Grams</span>
                </span>
            </div>
        </div>
    );
}

interface DashboardProps {
    onSetLimitClick?: () => void; // callback для кнопки
}

export default function Dashboard({ onSetLimitClick }: DashboardProps) {
    const dispatch = useAppDispatch();

    const calorieLimit = useAppSelector(state => state.calorieLimit.limit);
    const loading = useAppSelector(state => state.calorieLimit.loading);
    const ownerId = 1; // TODO: заміниш на auth.userId коли буде готово

    useEffect(() => {
        dispatch(getLimitRequest({ ownerId }));
    }, [dispatch, ownerId]);

    const meals = useAppSelector(state => state.meal.meals);

    const selectedDate = useAppSelector(state => state.date.selectedDate);

    const totals = useMemo(() => {
        const selDate = new Date(selectedDate);

        return meals
            .filter(meal => {
                const mealDate = new Date(meal.createdAt);
                return mealDate.toDateString() === selDate.toDateString();
            })
            .reduce((acc, meal) => {
                acc.calories += meal.calories ?? 0;
                acc.protein += meal.protein ?? 0;
                acc.fat += meal.fat ?? 0;
                acc.carb += meal.carbohydrate ?? 0;
                return acc;
            }, { calories: 0, protein: 0, fat: 0, carb: 0 });
    }, [meals, selectedDate]);


    const consumedCalories = totals.calories;
    const protein = totals.protein;
    const fat = totals.fat;
    const carb = totals.carb;


    const dailyGoal = calorieLimit?.limitValue;
    const progressPercentage = dailyGoal ? (consumedCalories / dailyGoal) * 100 : 0;
    const hasLimit = !!dailyGoal;

    return (
        <div className="space-y-4 mt-8">
            {loading && (
                <div className="text-center text-gray-500">Loading calorie limit...</div>
            )}

            <div className="relative bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-gray-600 text-sm font-medium">
                        Consumed this day
                    </h2>
                </div>
                <div className="text-center mb-3">
                    <span className="text-3xl font-bold text-green-500">{consumedCalories}</span>
                    <span className="text-xl text-gray-400"> / {dailyGoal?.toLocaleString()} Cal</span>
                    {hasLimit && onSetLimitClick && (
                        <button
                            onClick={onSetLimitClick}
                            className="ml-2 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                            title="Edit calorie goal"
                        >
                            <EditIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>
                {!hasLimit && onSetLimitClick && (
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={onSetLimitClick}
                            className="w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Set Goal
                        </button>
                    </div>
                )}
                <div className={`transition-all ${!hasLimit ? 'filter blur-sm pointer-events-none' : ''}`}>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1">
                <NutrientCard
                    label="Protein"
                    value={protein}
                    color="#3b82f6"
                    progressValue={protein}
                    progressMax={150}
                />
                <NutrientCard
                    label="Carb"
                    value={carb}
                    color="#f97316"
                    progressValue={carb}
                    progressMax={300}
                />
                <NutrientCard
                    label="Fat"
                    value={fat}
                    color="#eab308"
                    progressValue={fat}
                    progressMax={100}
                />
            </div>
        </div>
    );
}