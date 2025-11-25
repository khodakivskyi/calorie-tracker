import type {Meal} from "../store/types/mealTypes.ts";
import {useState} from "react";

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMeal: (meal: Meal) => void;
}

export default function AddMealModal({isOpen, onClose, onAddMeal}: AddMealModalProps) {
    const [meal, setMeal] = useState<Meal>();

    const handleSubmit = () => {
        const newMeal: Meal = {
            id: 1,
            name: "test",
            ownerId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        onAddMeal(newMeal);
        setMeal(meal);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-bold mb-4">Add Meal</h2>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg w-fit">Add</button>
                </div>
            </div>
        </div>
    );
}