import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { getLimitRequest } from "../store/slices/calorieLimitSlice";
import EditIcon from "../assets/icons/edit.svg?react";

/* =======================
   SEMI CIRCLE PROGRESS
======================= */
function SemiCircleProgress({
                                value,
                                max,
                                color,
                                size = 120
                            }: {
    value: number;
    max: number;
    color: string;
    size?: number;
}) {
    const percentage = max > 0 ? Math.min(value / max, 1) : 0;

    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    const circumference = Math.PI * radius; // 180°
    const dashOffset = circumference * (1 - percentage);

    const path = `
        M ${centerX - radius} ${centerY}
        A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
    `;

    return (
        <div className="relative w-full flex justify-center">
            <svg
                width={size}
                height={size / 2 + strokeWidth}
                viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
            >
                {/* background */}
                <path
                    d={path}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* progress */}
                <path
                    d={path}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-500"
                />
            </svg>

            {/* value inside */}
            <div className="absolute bottom-0 translate-y-1/2 text-center">
                <div className="text-xl font-bold" style={{ color }}>
                    {value.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">grams</div>
            </div>
        </div>
    );
}


/* =======================
   NUTRIENT CARD
======================= */
interface NutrientCardProps {
    label: string;
    value: number;
    color: string;
    max: number;
}

function NutrientCard({
                          label,
                          value,
                          color,
                          max
                      }: NutrientCardProps) {
    return (
        <div className="bg-white rounded-3xl p-4 flex flex-col items-center shadow-sm border border-gray-100">
            <SemiCircleProgress
                value={value}
                max={max}
                color={color}
            />

            <span
                className="mt-6 text-sm font-semibold tracking-wide"
                style={{ color }}
            >
                {label}
            </span>
        </div>
    );
}

/* =======================
   DASHBOARD
======================= */
interface DashboardProps {
    onSetLimitClick?: () => void;
}

export default function Dashboard({ onSetLimitClick }: DashboardProps) {
    const dispatch = useAppDispatch();

    const calorieLimit = useAppSelector(state => state.calorieLimit.limit);
    const loading = useAppSelector(state => state.calorieLimit.loading);
    const ownerId = 1; // TODO: замінити на auth.userId

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
            .reduce(
                (acc, meal) => {
                    acc.calories += meal.calories ?? 0;
                    acc.protein += meal.protein ?? 0;
                    acc.fat += meal.fat ?? 0;
                    acc.carb += meal.carbohydrate ?? 0;
                    return acc;
                },
                { calories: 0, protein: 0, fat: 0, carb: 0 }
            );
    }, [meals, selectedDate]);

    const consumedCalories = totals.calories;
    const dailyGoal = calorieLimit?.limitValue;
    const progressPercentage = dailyGoal
        ? (consumedCalories / dailyGoal) * 100
        : 0;
    const hasLimit = !!dailyGoal;

    return (
        <div className="space-y-4 mt-8">
            {loading && (
                <div className="text-center text-gray-500">
                    Loading calorie limit...
                </div>
            )}

            {/* Calories */}
            <div className="relative bg-white rounded-2xl p-6">
                <h2 className="text-gray-600 text-sm font-medium mb-2">
                    Consumed this day
                </h2>

                <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-green-500">
                        {consumedCalories}
                    </span>
                    <span className="text-xl text-gray-400">
                        {" "}
                        / {dailyGoal?.toLocaleString()} Cal
                    </span>

                    {hasLimit && onSetLimitClick && (
                        <button
                            onClick={onSetLimitClick}
                            className="ml-2 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        >
                            <EditIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {!hasLimit && onSetLimitClick && (
                    <div className="flex justify-center mb-3">
                        <button
                            onClick={onSetLimitClick}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-6 rounded-full transition shadow-md"
                        >
                            Set Goal
                        </button>
                    </div>
                )}

                <div
                    className={`transition-all ${
                        !hasLimit
                            ? "filter blur-sm pointer-events-none"
                            : ""
                    }`}
                >
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.min(
                                    progressPercentage,
                                    100
                                )}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Nutrients */}
            <div className="grid grid-cols-3 gap-3">
                <NutrientCard
                    label="Protein"
                    value={totals.protein}
                    color="#3b82f6"
                    max={150}
                />
                <NutrientCard
                    label="Carbs"
                    value={totals.carb}
                    color="#f97316"
                    max={300}
                />
                <NutrientCard
                    label="Fat"
                    value={totals.fat}
                    color="#eab308"
                    max={100}
                />
            </div>
        </div>
    );
}
