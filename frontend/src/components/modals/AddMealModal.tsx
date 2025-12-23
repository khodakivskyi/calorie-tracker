import type {MealDish} from "../../store/types/mealTypes.ts";
import type {Dish, DishWithFoods, DishFood} from "../../store/types/dishTypes.ts";
import {useState, useEffect, useCallback} from "react";
import SelectDishModal from "./SelectDishModal.tsx";
import CreateDishModal from "./CreateDishModal.tsx";
import UpdateDishModal from "./UpdateDishModal.tsx";
import {useAppSelector, useAppDispatch} from "../../store";
import {getFoodsByUserRequest} from "../../store/slices/foodsSlice.ts";
import {getDishesByUserRequest} from "../../store/slices/dishesSlice.ts";
import {createMealRequest} from "../../store/slices/mealSlice.ts";

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    mealType: string;
}

export default function AddMealModal({isOpen, onClose, mealType}: AddMealModalProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    //const {foods} = useAppSelector(state => state.food);
    const {dishes} = useAppSelector(state => state.dish);
    const {loading, error, success} = useAppSelector(state => state.meal);

    const [mealDishes, setMealDishes] = useState<MealDish[]>([]);
    const [showSelectDish, setShowSelectDish] = useState(false);
    const [showCreateDish, setShowCreateDish] = useState(false);
    const [showUpdateDish, setShowUpdateDish] = useState(false);
    const [dishToUpdate, setDishToUpdate] = useState<Dish | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            dispatch(getFoodsByUserRequest({ ownerId: user.id }));
            dispatch(getDishesByUserRequest({ ownerId: user.id }));
        }
    }, [isOpen, user, dispatch]);

    useEffect(() => {
        if (!isOpen) {
            setMealDishes([]);
            setShowSelectDish(false);
            setShowCreateDish(false);
            setShowUpdateDish(false);
            setDishToUpdate(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || dishes.length === 0) return;
        setMealDishes(prev =>
            prev.map(md => {
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
            })
        );
    }, [dishes, isOpen]);

    const handleSelectDish = useCallback((dish: Dish) => {
        const dishWithFoods: DishWithFoods = {...dish, foods: []};
        setMealDishes(prev => [...prev, {dishId: dish.id, weight: dish.weight, dish: dishWithFoods}]);
        setShowSelectDish(false);
    }, []);

    const handleCreateDish = useCallback((dish: Dish, ingredients: DishFood[]) => {
        const dishWithFoods: DishWithFoods = {...dish, foods: ingredients};
        setMealDishes(prev => [...prev, {dishId: dish.id, weight: dish.weight, dish: dishWithFoods}]);
        setShowCreateDish(false);
    }, []);

    const handleRemoveDish = useCallback((idx: number) => {
        setMealDishes(prev => prev.filter((_, i) => i !== idx));
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

    const getMealTypeId = (type: string): number => {
        const typeMap: Record<string, number> = {Breakfast: 1, Lunch: 2, Dinner: 3, Snack: 4};
        return typeMap[type] ?? 5;
    };

    const handleSubmit = useCallback(() => {
        if (!user || mealDishes.length === 0) return;

        const typeId = getMealTypeId(mealType);
        const payload = {
            ownerId: user.id,
            typeId,
            dishes: mealDishes.map(d => ({dishId: d.dishId, weight: d.weight})),
            ...(typeId === 5 ? {name: mealType} : {})
        };

        setIsSubmitting(true);
        dispatch(createMealRequest(payload));
    }, [user, mealType, mealDishes, dispatch]);

    useEffect(() => {
        if (isSubmitting && success && !loading) {
            onClose();
            setIsSubmitting(false);
        }
    }, [isSubmitting, success, loading, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-40">
                <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-2">Add {mealType}</h2>
                    <p className="text-sm text-gray-500 mb-4">Build your meal by adding dishes below.</p>

                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
                    {loading && <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">Creating meal...</div>}

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
                                {mealDishes.map((mealDish, idx) => {
                                    const dish = mealDish.dish;
                                    const foods = dish?.foods ?? [];
                                    return (
                                        <div key={`${mealDish.dishId}-${idx}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{dish?.name || "Dish"}</h4>
                                                    <p className="text-sm text-gray-600">Weight: {dish?.weight ?? 0}g</p>

                                                    {foods.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
                                                            <ul className="text-xs text-gray-600 space-y-0.5">
                                                                {foods.map((ing, i) => (
                                                                    <li key={`${ing.foodId}-${i}`}>
                                                                        • {ing.food?.name} - {ing.weight}g
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
                                                        onClick={() => handleRemoveDish(idx)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors">
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
