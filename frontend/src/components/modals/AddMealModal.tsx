import type {Meal, MealDish} from "../../store/types/mealTypes.ts";
import type {Dish, DishWithFoods, DishFood} from "../../store/types/dishTypes.ts";
import {useState, useEffect, useCallback} from "react";
import SelectDishModal from "./SelectDishModal.tsx";
import CreateDishModal from "./CreateDishModal.tsx";
import UpdateDishModal from "./UpdateDishModal.tsx";
import {useAppSelector, useAppDispatch} from "../../store";
import {getFoodsByUserRequest} from "../../store/slices/foodsSlice.ts";
import {getDishesByUserRequest} from "../../store/slices/dishesSlice.ts";

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMeal: (meal: Meal) => void;
    mealType: string;
}

/**
 * Modal for adding a meal (breakfast/lunch/dinner).
 * User can add multiple dishes to the meal.
 * Simple architecture: uses boolean flags for child modals.
 */
export default function AddMealModal({isOpen, onClose, onAddMeal, mealType}: AddMealModalProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    const {foods} = useAppSelector(state => state.food);
    const {dishes} = useAppSelector(state => state.dish);

    // Main state: list of dishes in this meal
    const [mealDishes, setMealDishes] = useState<MealDish[]>([]);
    
    // Child modals
    const [showSelectDish, setShowSelectDish] = useState(false);
    const [showCreateDish, setShowCreateDish] = useState(false);
    const [showUpdateDish, setShowUpdateDish] = useState(false);
    const [dishToUpdate, setDishToUpdate] = useState<Dish | null>(null);

    // Load data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            if (foods.length === 0) {
                dispatch(getFoodsByUserRequest({ownerId: user.id}));
            }
            if (dishes.length === 0) {
                dispatch(getDishesByUserRequest({ownerId: user.id}));
            }
        }
    }, [isOpen, user, dispatch, foods.length, dishes.length]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setMealDishes([]);
            setShowSelectDish(false);
            setShowCreateDish(false);
            setShowUpdateDish(false);
            setDishToUpdate(null);
        }
    }, [isOpen]);

    // Keep local meal dishes in sync if a dish was updated in the store
    useEffect(() => {
        if (!isOpen || dishes.length === 0) return;
        setMealDishes(prev => prev.map(md => {
            const updatedDish = dishes.find(d => d.id === md.dishId);
            if (!updatedDish) return md;
            return {
                ...md,
                weight: updatedDish.weight,
                dish: {
                    ...updatedDish,
                    foods: md.dish?.foods ?? []
                }
            };
        }));
    }, [dishes, isOpen]);

    // Add existing dish from library
    const handleSelectDish = useCallback((dish: Dish) => {
        const dishWithFoods: DishWithFoods = {...dish, foods: []};
        setMealDishes(prev => [...prev, {
            dishId: dish.id,
            weight: dish.weight,
            dish: dishWithFoods
        }]);
        setShowSelectDish(false);
    }, []);

    // Add newly created dish
    const handleCreateDish = useCallback((dish: Dish, ingredients: DishFood[]) => {
        const dishWithFoods: DishWithFoods = {...dish, foods: ingredients};
        setMealDishes(prev => [...prev, {
            dishId: dish.id,
            weight: dish.weight,
            dish: dishWithFoods
        }]);
        setShowCreateDish(false);
    }, []);

    // Remove dish from meal
    const handleRemoveDish = useCallback((dishId: number) => {
        setMealDishes(prev => prev.filter(md => md.dishId !== dishId));
    }, []);

    const handleOpenUpdateDish = useCallback((mealDish: MealDish) => {
        const fallbackDish = dishes.find(d => d.id === mealDish.dishId) || null;
        const targetDish = mealDish.dish || fallbackDish;
        if (!targetDish) return;
        setDishToUpdate(targetDish);
        setShowUpdateDish(true);
    }, [dishes]);

    const handleCloseUpdateDish = useCallback(() => {
        setShowUpdateDish(false);
        setDishToUpdate(null);
    }, []);

    // Submit meal
    const handleSubmit = useCallback(() => {
        if (!user || mealDishes.length === 0) return;

        const newMeal: Meal = {
            id: Date.now(),
            name: mealType,
            ownerId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onAddMeal(newMeal);
        onClose();
    }, [user, mealType, mealDishes.length, onAddMeal, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-40">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-2">Add {mealType}</h2>
                    <p className="text-sm text-gray-500 mb-4">Build your meal by adding dishes below.</p>

                    {/* Dishes section */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Dishes</h3>
                            <button
                                onClick={() => setShowSelectDish(true)}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                + Add Dish
                            </button>
                        </div>

                        {mealDishes.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No dishes added yet</p>
                        ) : (
                            <div className="space-y-3">
                                {mealDishes.map((mealDish, idx) => (
                                    <div key={`${mealDish.dishId}-${idx}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-lg">{mealDish.dish?.name || "Dish"}</h4>
                                                <p className="text-sm text-gray-600">Weight: {mealDish.dish?.weight || 0}g</p>
                                                
                                                {/* Show ingredients if available */}
                                                {mealDish.dish?.foods && mealDish.dish.foods.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
                                                        <ul className="text-xs text-gray-600 space-y-0.5">
                                                            {mealDish.dish.foods.map((ing) => (
                                                                <li key={`${ing.foodId}-${idx}`}>
                                                                    • {ing.food?.name || "Ingredient"} - {ing.weight}g
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <button
                                                    onClick={() => handleOpenUpdateDish(mealDish)}
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveDish(mealDish.dishId)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={mealDishes.length === 0}
                            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Meal
                        </button>
                    </div>
                </div>
            </div>

            {/* Child modals */}
            <SelectDishModal
                isOpen={showSelectDish}
                onClose={() => setShowSelectDish(false)}
                onSelectDish={handleSelectDish}
                onCreateDish={() => {
                    setShowSelectDish(false);
                    setShowCreateDish(true);
                }}
                readyDishes={dishes}
            />

            <CreateDishModal
                isOpen={showCreateDish}
                onClose={() => setShowCreateDish(false)}
                onSuccess={handleCreateDish}
            />

            <UpdateDishModal
                isOpen={showUpdateDish}
                dish={dishToUpdate}
                onClose={handleCloseUpdateDish}
            />
        </>
    );
}
