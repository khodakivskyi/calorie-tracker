import { useState } from 'react';

export default function DateSelector() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const baseDate = new Date();

    for (let i = -3; i <= 3; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const day = date.getDate();
        const isToday = date.getTime() === today.getTime();
        const isSelected = date.getTime() === selectedDate.getTime();

        days.push({ date, dayName, day, isToday, isSelected });
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex flex-row gap-2 pt-8">
            {days.map((dayInfo, index) => (
                <button
                    key={index}
                    onClick={() => handleDateClick(dayInfo.date)}
                    className={`flex flex-col items-center justify-center flex-1 p-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        dayInfo.isSelected
                            ? 'bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/50'
                            : dayInfo.isToday
                            ? 'bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                >
                    <span className={`text-xs font-medium mb-1 ${
                        dayInfo.isSelected ? 'text-white/90' : 'text-gray-500'
                    }`}>
                        {dayInfo.dayName}
                    </span>
                    <span className={`text-lg font-bold ${
                        dayInfo.isSelected ? 'text-white' : dayInfo.isToday ? 'text-primary-700' : 'text-gray-800'
                    }`}>
                        {dayInfo.day}
                    </span>
                </button>
            ))}
        </div>
    );
}