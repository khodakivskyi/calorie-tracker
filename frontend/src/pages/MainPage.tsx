import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import DateSelector from "../components/DateSelector.tsx";
import Header from "../components/Header.tsx";
import Dashboard from "../components/Dashboard.tsx";
import { Link } from 'react-router-dom';
import CalorieGoalModal from "../components/modals/CalorieGoalModal.tsx";
import { setLimitRequest, removeLimitRequest } from "../store/slices/calorieLimitSlice";

export default function MainPage() {
    const dispatch = useAppDispatch();

    const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);

    const calorieLimit = useAppSelector(state => state.calorieLimit.limit);
    const currentLimit = calorieLimit?.limitValue ?? 2500;

    const ownerId = 1; // TODO: підставити auth.userId

    const handleSaveLimit = (newLimit: number) => {
        if (newLimit <= 0) {
            // якщо значення <= 0, видаляємо ліміт
            dispatch(removeLimitRequest({ ownerId }));
        } else {
            // інакше оновлюємо/створюємо ліміт
            dispatch(setLimitRequest({ ownerId, limitValue: newLimit }));
        }
        setIsCalorieModalOpen(false);
    };

    return (
        <div className="min-h-screen pb-24">
            <Header/>
            <DateSelector/>
            <Dashboard onSetLimitClick={() => setIsCalorieModalOpen(true)}/>

            <div className="mt-8 px-4 flex flex-col gap-3">
                <Link to="/add-meal">
                    <button
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
                        + Add Meals
                    </button>
                </Link>

                <button
                    onClick={() => setIsCalorieModalOpen(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
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
    )
}
