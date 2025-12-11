import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { fetchChartDataRequest } from '../store/slices/caloriesChartSlice';

interface CaloriesChartProps {
    dailyGoal: number;
}

export default function CaloriesChart({ dailyGoal }: CaloriesChartProps) {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<'Week' | 'Month'>('Week');

    const { data, isLoading } = useAppSelector(state => state.caloriesChart);

    useEffect(() => {
        dispatch(fetchChartDataRequest({ period: activeTab }));
    }, [activeTab, dispatch]);

    const chartData = useMemo(() => {
        if (activeTab === 'Month') return data;

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const currentDay = today.getDay(); 
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

        const mondayDate = new Date(today);
        mondayDate.setDate(today.getDate() - diffToMonday);
        mondayDate.setHours(0, 0, 0, 0);

        const result = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 7; i++) {
            const loopDate = new Date(mondayDate);
            loopDate.setDate(mondayDate.getDate() + i);
            loopDate.setHours(0, 0, 0, 0);


            const y = loopDate.getFullYear();
            const m = String(loopDate.getMonth() + 1).padStart(2, '0');
            const d = String(loopDate.getDate()).padStart(2, '0');
            const dateString = `${y}-${m}-${d}`;

            const existingData = data.find((item: any) =>
                (item.fullDate && item.fullDate.startsWith(dateString)) ||
                (item.date && item.date.startsWith(dateString))
            );

            result.push({
                name: dayNames[i],
                fullDate: dateString,
                calories: existingData ? existingData.calories : 0, 
            });
        }

        return result;
    }, [data, activeTab]);


    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            const dateObj = new Date(dataPoint.fullDate);

            const dateLabel = activeTab === 'Week'
                ? dateObj.toLocaleDateString('en-US', { weekday: 'long' })
                : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-xs z-50 min-w-[120px]">
                    <p className="font-semibold text-gray-700 mb-1">{dateLabel}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-green-500">
                            {payload[0].value}
                        </span>
                        <span className="text-gray-400 font-medium">kcal</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h3 className="text-lg font-bold text-gray-800">Calorie History</h3>

                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    {(['Week', 'Month'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            disabled={isLoading}
                            className={`
                                px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                                ${activeTab === tab
                                    ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-400 hover:text-gray-600'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-[300px] relative">

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-[1px]">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {!isLoading && chartData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
                        No activity data
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#E5E7EB"
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            dy={15}
                            interval={activeTab === 'Month' ? 'preserveStartEnd' : 0}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            dx={-10}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
                        />

                        {dailyGoal > 0 && (
                            <ReferenceLine
                                y={dailyGoal}
                                stroke="#EF4444"
                                strokeDasharray="3 3"
                                strokeOpacity={0.4}
                            />
                        )}

                        <Bar
                            dataKey="calories"
                            fill="#22C55E"
                            radius={[6, 6, 0, 0]}
                            barSize={activeTab === 'Week' ? 48 : 10}
                            animationDuration={1200}
                            animationBegin={200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}