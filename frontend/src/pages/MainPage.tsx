import { useState } from "react";
import DateSelector from "../components/DateSelector.tsx";
import Header from "../components/Header.tsx";
import Dashboard from "../components/Dashboard.tsx";
import { Link } from 'react-router-dom';
import CalorieGoalModal from "../components/CalorieGoalModal.tsx";

export default function MainPage() {

    const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);

    return (
        <div className="min-h-screen pb-24">
            <Header/>
            <DateSelector/>
            <Dashboard/> {/* передаємо goal для Dashboard */}

            <div className="mt-8 px-4 flex flex-col gap-3">
                <Link to="/add-meal">
                    <button
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
                        + Add Meals
                    </button>
                </Link>

                {/* Кнопка для відкриття модалки ліміту калорій */}
                <button
                    onClick={() => setIsCalorieModalOpen(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Set Daily Calorie Goal
                </button>
            </div>

            {/* Модалка */}
            <CalorieGoalModal
                isOpen={isCalorieModalOpen}
                onClose={() => setIsCalorieModalOpen(false)}
                currentLimit={2500}
                onSave={() => {}}
            />
        </div>
    )
}
