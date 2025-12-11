import { useState, useEffect } from 'react';
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
    const [activeTab, setActiveTab] = useState<'Week' | 'Month' | 'Year'>('Week');
    const { data, isLoading } = useAppSelector(state => state.caloriesChart);

    useEffect(() => {
        dispatch(fetchChartDataRequest({ period: activeTab }));
    }, [activeTab, dispatch]);

    interface TooltipProps {
        active?: boolean;
        payload?: Array<{ value: number }>;
        label?: string;
    }

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-xs">
                    <p className="font-semibold text-gray-700 mb-1">{label}</p>
                    <p className="text-primary-600">
                        {payload[0].value} <span className="text-gray-400">kcal</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative min-h-[300px]">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-gray-700 font-semibold">History</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['Week', 'Month', 'Year'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            disabled={isLoading}
                            className={`
                                px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                                ${activeTab === tab
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-64 w-full">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        ������������...
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                        {dailyGoal > 0 && (
                            <ReferenceLine
                                y={dailyGoal}
                                stroke="#ef4444"
                                strokeDasharray="3 3"
                                label={{ position: 'top', value: 'Goal', fill: '#ef4444', fontSize: 10 }}
                            />
                        )}
                        <Bar
                            dataKey="calories"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                            barSize={activeTab === 'Month' ? 12 : 32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}