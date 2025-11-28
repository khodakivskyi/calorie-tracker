import { useState, useEffect } from "react";

interface DayLog {
    date: string;
    calories: number;
}

interface ActivityHeatmapProps {
    logs: DayLog[];
    dailyGoal: number;
}

export default function ActivityHeatmap({ logs, dailyGoal }: ActivityHeatmapProps) {
    const [calendarDays, setCalendarDays] = useState<{ date: string | null; calories: number | null }[]>([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

    const isGoalSet = dailyGoal > 0;

    useEffect(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const daysArray = [];

        for (let i = 0; i < startDayIndex; i++) {
            daysArray.push({ date: null, calories: null });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const log = logs.find(l => l.date === dayString);

            daysArray.push({
                date: dayString,
                calories: log ? log.calories : null
            });
        }

        setCalendarDays(daysArray);
    }, [logs, currentYear, currentMonth]);

    const getStatusColor = (calories: number | null) => {
        if (calories === null) return "bg-gray-100";
        if (!isGoalSet) return "bg-gray-200";

        const diff = calories - dailyGoal;

        if (diff > 150) return "bg-error";
        if (diff < -150) return "bg-warning";
        return "bg-primary-500";
    };

    const getTooltipText = (calories: number | null, date: string | null) => {
        if (!date) return "";
        if (calories === null) return `${date}: No data`;
        return `${date}: ${calories} kcal`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden z-0 isolate">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-700 font-semibold capitalize">
                    Activity: {monthName} {currentYear}
                </h3>
                <span className={`text-xs ${isGoalSet ? 'text-gray-400' : 'text-error font-medium'}`}>
                    {isGoalSet ? `Goal: ${dailyGoal} kcal` : 'No goal set'}
                </span>
            </div>

            <div className="relative">
                {!isGoalSet && (
                    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-lg">
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-600 text-center">
                            Please set a daily calorie goal <br /> to view analytics
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-7 gap-2 mb-6 transition-opacity duration-300 ${!isGoalSet ? 'opacity-30 pointer-events-none' : ''}`}>
                    {weekDays.map(day => (
                        <div key={day} className="text-xs text-center text-gray-400 font-medium py-1">
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`
                                aspect-square rounded-md transition-all duration-200 relative group
                                ${day.date ? getStatusColor(day.calories) : 'bg-transparent'}
                                ${day.date && isGoalSet ? 'hover:opacity-80 cursor-pointer' : ''}
                            `}
                        >
                            {day.date && isGoalSet && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                    {getTooltipText(day.calories, day.date)}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={`flex flex-wrap gap-4 text-xs text-gray-500 justify-center border-t border-gray-50 pt-4 ${!isGoalSet ? 'opacity-30' : ''}`}>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-primary-500"></div>
                        <span>Normal</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-warning"></div>
                        <span>Deficit</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-error"></div>
                        <span>Surplus</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
                        <span>Missed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}