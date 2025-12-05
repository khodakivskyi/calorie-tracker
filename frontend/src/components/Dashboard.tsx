import {useEffect} from "react";

interface CircularProgressProps {
    value: number;
    max: number;
    color: string;
    size?: number;
}

function CircularProgress({ value, max, color, size = 60 }: CircularProgressProps) {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
            >
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
        <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
            <CircularProgress value={progressValue} max={progressMax} color={color} />
            <div className="flex flex-col">
                <span className="text-sm font-medium" style={{ color }}>{label}</span>
                <span className="text-xl font-semibold" style={{ color }}>
                    {value} <span className="text-base font-normal">Cal</span>
                </span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    useEffect(() => {

    }, []);

    const consumedCalories = 529;
    const dailyGoal = 2500;
    const progressPercentage = (consumedCalories / dailyGoal) * 100;

    return (
        <div className="space-y-4 mt-8">
            {/* Main calorie summary block */}
            <div className="bg-white rounded-2xl p-6">
                <div className="space-y-3">
                    <h2 className="text-gray-600 text-sm font-medium">Consumed today</h2>
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-green-500">{consumedCalories}</span>
                            <span className="text-xl text-gray-400">/ {dailyGoal.toLocaleString()} Cal</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Nutrient cards grid block */}
            <div className="grid grid-cols-2 gap-4">
                <NutrientCard
                    label="Protein"
                    value={856}
                    color="#3b82f6"
                    progressValue={856}
                    progressMax={1200}
                />
                <NutrientCard
                    label="Carbohydrates"
                    value={128}
                    color="#f97316"
                    progressValue={128}
                    progressMax={200}
                />
                <NutrientCard
                    label="Fat"
                    value={173}
                    color="#eab308"
                    progressValue={173}
                    progressMax={300}
                />
                <NutrientCard
                    label="Mock"
                    value={199}
                    color="#a855f7"
                    progressValue={199}
                    progressMax={300}
                />
            </div>
        </div>
    )
}