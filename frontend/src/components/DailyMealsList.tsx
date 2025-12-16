import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { getMealsByUserRequest } from "../store/slices/mealSlice";
import { Link } from "react-router-dom";
import DailyMealCard from "./DailyMealCard.tsx";

export default function DailyMealsList() {
    const dispatch = useAppDispatch();
    const meals = useAppSelector(state => state.meal.meals);
    const selectedDate = useAppSelector(state => state.date.selectedDate);
    const user = useAppSelector(state => state.auth.user);

    useEffect(() => {
        if (user) {
            console.log("Dispatching getMealsByUserRequest for user:", user.id);
            dispatch(getMealsByUserRequest({ ownerId: user.id }));
        }
    }, [dispatch, user]);

    console.log("All meals from state:", meals);
    console.log("Selected date:", selectedDate);

    const mealsForDay = meals.filter(meal => {
        const mealDate = new Date(meal.createdAt);
        const selDate = new Date(selectedDate);

        const match = mealDate.toDateString() === selDate.toDateString();

        console.log(`Comparing meal ${meal.id} date ${mealDate.toDateString()} with selected ${selDate.toDateString()}:`, match);
        return match;
    });

    console.log("Meals for selected day:", mealsForDay);

    if (mealsForDay.length === 0) {
        return (
            <div className="mt-8 px-4 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold mb-4">Today Meals</h2>
                <Link to="/add-meal">
                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition shadow-md hover:shadow-lg">
                        + Add Meals
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-6 px-4 flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Today Meals</h3>
            {mealsForDay.map(meal => (
                <DailyMealCard
                    key={meal.id}
                    id={meal.id}
                    name={meal.name}
                    calories={meal.calories}
                    onEdit={() => console.log("Edit meal", meal.id)}
                    onDelete={() => console.log("Delete meal", meal.id)}
                />
            ))}
        </div>
    );
}
