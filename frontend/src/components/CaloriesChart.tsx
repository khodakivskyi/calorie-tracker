import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface CaloriesChartProps {
    dailyGoal: number;
}

export default function CaloriesChart({ dailyGoal }: CaloriesChartProps) {
    const [activeTab, setActiveTab] = useState<'Week' | 'Month' | 'Year'>('Week');

    const data = useMemo(() => {
        if (activeTab === 'Week') {
            return [
                { name: 'Mon', calories: 2100 },
                { name: 'Tue', calories: 2400 },
                { name: 'Wed', calories: 1800 },
                { name: 'Thu', calories: 2600 },
                { name: 'Fri', calories: 2200 },
                { name: 'Sat', calories: 2900 },
                { name: 'Sun', calories: 2300 },
            ];
        }
        if (activeTab === 'Month') {
            return Array.from({ length: 30 }, (_, i) => ({
                name: `${i + 1} Nov`,
                calories: Math.floor(Math.random() * (3000 - 1500) + 1500),
            }));
        }
        if (activeTab === 'Year') {
            return [
                { name: 'Jan', calories: 2100 },
                { name: 'Feb', calories: 2300 },
                { name: 'Mar', calories: 1950 },
                { name: 'Apr', calories: 2400 },
                { name: 'May', calories: 2600 },
                { name: 'Jun', calories: 2200 },
                { name: 'Jul', calories: 2100 },
                { name: 'Aug', calories: 2000 },
                { name: 'Sep', calories: 2500 },
                { name: 'Oct', calories: 2450 },
                { name: 'Nov', calories: 2300 },
                { name: 'Dec', calories: 0 },
            ];
        }
        return [];
    }, [activeTab]);

    const CustomTooltip = ({ active, payload, label }: any) => {
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-gray-700 font-semibold">History</h3>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['Week', 'Month', 'Year'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
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
                                label={{
                                    position: 'top',
                                    value: 'Goal',
                                    fill: '#ef4444',
                                    fontSize: 10
                                }}
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