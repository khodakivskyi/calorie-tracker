import ActivityHeatmap from "../components/ActivityHeatmap";
import CaloriesChart from '../components/CaloriesChart';

export default function AnalyticsPage() {

    const dailyGoal = 500;

    return (
        <div className="min-h-screen font-sans">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My progress</h1>

            <div className="space-y-6">
                <CaloriesChart dailyGoal={dailyGoal} />
                <ActivityHeatmap dailyGoal={dailyGoal} />
            </div>
        </div>
    );
}