import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import DateSelector from "../components/DateSelector";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import DailyMealsList from "../components/DailyMealsList";
import CalorieGoalModal from "../components/modals/CalorieGoalModal";
import { setLimitRequest, removeLimitRequest } from "../store/slices/calorieLimitSlice";

export default function MainPage() {
    const dispatch = useAppDispatch();
    const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);

    const calorieLimit = useAppSelector(state => state.calorieLimit.limit);
    const currentLimit = calorieLimit?.limitValue ?? 2500;

    const ownerId = 1; // TODO: auth.userId

    const handleSaveLimit = (newLimit: number) => {
        if (newLimit <= 0) {
            dispatch(removeLimitRequest({ ownerId }));
        } else {
            dispatch(setLimitRequest({ ownerId, limitValue: newLimit }));
        }
        setIsCalorieModalOpen(false);
    };

    return (
        <div className="min-h-screen pb-24">
            <Header />
            <DateSelector />

            <Dashboard onSetLimitClick={() => setIsCalorieModalOpen(true)} />

            <DailyMealsList />

            <div className="mt-6 px-4">
                <button
                    onClick={() => setIsCalorieModalOpen(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition shadow-md hover:shadow-lg"
                >
                    Change Daily Calorie Goal
                </button>
            </div>

            <CalorieGoalModal
                isOpen={isCalorieModalOpen}
                onClose={() => setIsCalorieModalOpen(false)}
                currentLimit={currentLimit}
                onSave={handleSaveLimit}
            />
        </div>
    );
}
