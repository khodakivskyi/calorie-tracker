import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setSelectedDate } from "../store/slices/dateSlice";

export default function DateSelector() {
    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state.date.selectedDate);

    // today стабільний
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // при першому завантаженні — вибираємо сьогодні
    useEffect(() => {
        if (!selectedDate) {
            dispatch(setSelectedDate(today.toISOString()));
        }
    }, [dispatch, selectedDate, today]);

    // будуємо список днів
    const days = useMemo(() => {
        const baseDate = new Date(today);
        const result = [];

        for (let i = -3; i <= 3; i++) {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + i);

            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const day = date.getDate();

            const isToday = date.getTime() === today.getTime();
            const isSelected =
                selectedDate &&
                date.getTime() === new Date(selectedDate).setHours(0, 0, 0, 0);

            result.push({ date, dayName, day, isToday, isSelected });
        }

        return result;
    }, [today, selectedDate]);

    const handleDateClick = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        dispatch(setSelectedDate(normalized.toISOString()));
    };

    return (
        <div className="flex gap-2 pt-8">
            {days.map((dayInfo, index) => (
                <button
                    key={index}
                    onClick={() => handleDateClick(dayInfo.date)}
                    className={`
                        flex flex-col items-center justify-center flex-1 p-2 rounded-2xl
                        transition-all duration-200 transform hover:scale-105 active:scale-95
                        ${
                        dayInfo.isSelected
                            ? "bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/50"
                            : dayInfo.isToday
                                ? "bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100"
                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-gray-50"
                    }
                    `}
                >
                    <span
                        className={`text-xs font-medium mb-1 ${
                            dayInfo.isSelected ? "text-white/90" : "text-gray-500"
                        }`}
                    >
                        {dayInfo.dayName}
                    </span>

                    <span
                        className={`text-lg font-bold ${
                            dayInfo.isSelected
                                ? "text-white"
                                : dayInfo.isToday
                                    ? "text-primary-700"
                                    : "text-gray-800"
                        }`}
                    >
                        {dayInfo.day}
                    </span>
                </button>
            ))}
        </div>
    );
}
