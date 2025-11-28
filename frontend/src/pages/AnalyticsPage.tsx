import React from 'react';
import ActivityHeatmap from "../components/ActivityHeatmap.tsx";
import CaloriesChart from '../components/CaloriesChart';

export default function AnalyticsPage() {

    const mockLogs = [
        { date: '2025-11-01', calories: 2400 }, // Зелений (Норма)
        { date: '2025-11-02', calories: 2550 }, // Зелений (Норма)
        { date: '2025-11-03', calories: 3200 }, // Червоний (Перебір)
        { date: '2025-11-04', calories: 1200 }, // Жовтий (Недобрав)
        { date: '2025-11-05', calories: 2500 }, // Зелений
        { date: '2025-11-10', calories: 2600 }, // Зелений
        { date: '2025-11-24', calories: 2450 }, // Сьогодні
    ];

    const myDailyGoal = 0;

    return (
        <div className="p-6 bg-green-50 min-h-screen font-sans">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My progress</h1>

            <div className="space-y-6">
                <CaloriesChart />
                <ActivityHeatmap
                    logs={mockLogs}
                    dailyGoal={myDailyGoal}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                </div>

            </div>
        </div>
    );
}