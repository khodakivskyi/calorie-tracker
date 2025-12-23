import Breakfast from '../assets/images/Breakfast.png';
import Lunch from '../assets/images/Lunch.png';
import Snack from '../assets/images/Snack.png';
import Dinner from '../assets/images/Dinner.png';

import AddMealModal from './modals/AddMealModal.tsx';
import { useEffect, useState } from "react";
import type { Meal } from "../store/types/mealTypes.ts";
import { useAppSelector } from "../store";

const mealTypes = [
    { id: 'breakfast', type: 1, name: 'Breakfast', imagePosition: 'right', imageUrl: Breakfast },
    { id: 'lunch', type: 2, name: 'Lunch', imagePosition: 'left', imageUrl: Lunch },
    { id: 'dinner', type: 3, name: 'Dinner', imagePosition: 'left', imageUrl: Dinner },
    { id: 'snack', type: 4, name: 'Snack', imagePosition: 'right', imageUrl: Snack },
    { id: 'custom', type: 5, name: 'Custom', imagePosition: 'right', imageUrl: Dinner }
] as const;

export default function AddMeal() {
    const mealsFromRedux = useAppSelector(state => state.meal.meals);
    const selectedDate = useAppSelector(state => state.date.selectedDate);

    const [meals, setMeals] = useState<Meal[] | null>(null);

    useEffect(() => {
        setMeals(mealsFromRedux);
    }, [mealsFromRedux]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ id: string; name: string } | null>(null);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const allImagesLoaded = loadedImagesCount >= mealTypes.length;

    if (!allImagesLoaded || !meals) {
        return (
            <>
                {/* LOADER */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"/>
                        <span className="text-white text-sm opacity-80">Loading meals...</span>
                    </div>
                </div>
            </>
        )
    }

    const mealsForDay = meals.filter(meal => {
        const mealDate = new Date(meal.createdAt);
        const selDate = new Date(selectedDate);
        return mealDate.toDateString() === selDate.toDateString();
    });

    const hasMealOfTypeToday = (type: number) => {
        if (type === 5 || type === 4) return false;
        return mealsForDay.some(m => m.typeId === type);
    };

    const handleOpenModal = (meal: { id: string; name: string }) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedMeal(null);
        setModalOpen(false);
    };


    return (
        <>
            {/* MAIN CONTENT */}
            <div className={allImagesLoaded ? '' : 'pointer-events-none select-none'}>
                {mealTypes.map(meal => {
                    const isDisabled = hasMealOfTypeToday(meal.type);

                    return (
                        <div
                            key={meal.id}
                            className={`
                                bg-white overflow-hidden rounded-2xl p-4 mb-4 h-[8.5rem]
                                ${isDisabled ? 'opacity-60 pointer-events-none' : ''}
                            `}
                        >
                            <div className={`flex justify-between items-start ${
                                meal.imagePosition === 'right' ? 'flex-row' : 'flex-row-reverse'
                            }`}>
                                <div className={`flex flex-col ${
                                    meal.imagePosition === 'right' ? 'flex-1' : 'items-end'
                                }`}>
                                    <h3 className="font-bold text-lg">{meal.name}</h3>
                                    <button
                                        disabled={isDisabled}
                                        onClick={() => handleOpenModal(meal)}
                                        className={`
                                            mt-2 px-4 py-2 rounded-lg w-fit
                                            ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white'}
                                        `}
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
                                            ${meal.imagePosition === 'right' ? 'bottom-10 left-10' : 'top-2 right-12'}
                                            w-340 h-340
                                            object-cover
                                            transition-opacity duration-500
                                            ${allImagesLoaded ? 'opacity-100' : 'opacity-0'}
                                        `}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddMealModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mealType={selectedMeal?.name || ''}
            />
        </>
    );
}
