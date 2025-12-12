import { useAppSelector } from "../store";
import { Link } from "react-router-dom";

export default function DailyMealsList() {
    const meals = useAppSelector(state => state.meal.meals);
    const selectedDate = useAppSelector(state => state.date.selectedDate);

    const mealsForDay = meals.filter(m => m.createdAt.startsWith(selectedDate));

    if (mealsForDay.length === 0) {
        return (
            <div className="mt-8 px-4">
                <Link to="/add-meal">
                    <button
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition shadow-md hover:shadow-lg">
                        + Add Meals
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-6 px-4 flex flex-col gap-4">
            {mealsForDay.map(meal => (
                <div key={meal.id} className="p-4 bg-white rounded-xl shadow">
                    <div className="text-lg font-semibold">{meal.name}</div>
                    <div className="text-sm text-gray-500">
                        {meal.calories ?? 0} kcal
                    </div>
                </div>
            ))}
        </div>
    );
}
