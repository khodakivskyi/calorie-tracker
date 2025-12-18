import Breakfast from '../assets/images/Breakfast.png';
import Lunch from '../assets/images/Lunch.png';
import Snack from '../assets/images/Snack.png';
import Dinner from '../assets/images/Dinner.png';

import AddMealModal from './modals/AddMealModal.tsx';
import { useState, useEffect } from "react";
import type { Meal } from "../store/types/mealTypes.ts";

export default function AddMeal() {
    const [_meals, setMeals] = useState<Meal[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ id: string; name: string } | null>(null);

    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const handleAddMeal = (meal: Meal) => {
        setMeals((prev) => {
            const updated = [...prev, meal];
            localStorage.setItem("meals", JSON.stringify(updated));
            return updated;
        });
    };

    const handleOpenModal = (meal: { id: string; name: string }) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedMeal(null);
        setModalOpen(false);
    };

    useEffect(() => {
        try {
            const savedMeals = localStorage.getItem("meals");
            if (savedMeals) {
                const parsed = JSON.parse(savedMeals);
                if (Array.isArray(parsed)) setMeals(parsed);
            }
        } catch {
            localStorage.removeItem("meals");
        }
    }, []);

    const mealTypes = [
        { id: 'breakfast', name: 'Breakfast', imagePosition: 'right', imageUrl: Breakfast },
        { id: 'lunch', name: 'Lunch', imagePosition: 'left', imageUrl: Lunch },
        { id: 'snack', name: 'Snack', imagePosition: 'right', imageUrl: Snack },
        { id: 'dinner', name: 'Dinner', imagePosition: 'left', imageUrl: Dinner },
        { id: 'custom', name: 'Custom', imagePosition: 'right', imageUrl: Dinner }
    ] as const;

    const allImagesLoaded = loadedImagesCount >= mealTypes.length;

    return (
        <>
            {/* LOADER */}
            {!allImagesLoaded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-white text-sm opacity-80">
                            Loading meals...
                        </span>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className={allImagesLoaded ? '' : 'pointer-events-none select-none'}>
                {mealTypes.map((meal) => (
                    <div
                        key={meal.id}
                        className="bg-white overflow-hidden rounded-2xl p-4 mb-4 h-[8.5rem]"
                    >
                        <div
                            className={`flex justify-between items-start ${
                                meal.imagePosition === 'right'
                                    ? 'flex-row'
                                    : 'flex-row-reverse'
                            }`}
                        >
                            <div
                                className={`flex flex-col ${
                                    meal.imagePosition === 'right'
                                        ? 'flex-1'
                                        : 'items-end'
                                }`}
                            >
                                <h3 className="font-bold text-lg">{meal.name}</h3>
                                <button
                                    onClick={() => handleOpenModal(meal)}
                                    className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg w-fit"
                                >
                                    + Add
                                </button>
                            </div>

                            <div className="w-48 h-48 -m-4 overflow-hidden relative flex-shrink-0">
                                <img
                                    src={meal.imageUrl}
                                    alt={meal.name}
                                    onLoad={() => setLoadedImagesCount(c => c + 1)}
                                    className={`
                                        relative
                                        ${
                                        meal.imagePosition === 'right'
                                            ? 'bottom-10 left-10'
                                            : 'top-2 right-12'
                                    }
                                        w-340 h-340
                                        object-cover
                                        transition-opacity duration-500
                                        ${allImagesLoaded ? 'opacity-100' : 'opacity-0'}
                                    `}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddMealModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddMeal={handleAddMeal}
                mealType={selectedMeal?.name || ''}
            />
        </>
    );
}
