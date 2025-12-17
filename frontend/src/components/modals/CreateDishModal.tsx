import type {Dish, DishFood, DishWithFoods} from "../../store/types/dishTypes.ts";
import {useState, useMemo, useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store";
import {createDishRequest} from "../../store/slices/dishesSlice.ts";
import SelectIngredientModal from "./SelectIngredientModal.tsx";
import CreateIngredientModal from "./CreateIngredientModal.tsx";
import type {Food} from "../../store/types/foodTypes.ts";

interface CreateDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (dish: Dish, ingredients: DishFood[]) => void;
}

/**
 * Self-contained modal for creating a new dish with ingredients.
 * Manages its own ingredient selection/creation modals internally.
 */
export default function CreateDishModal({
                                            isOpen,
                                            onClose,
                                            onSuccess
                                        }: CreateDishModalProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    const {foods} = useAppSelector(state => state.food);
    const {loading, success, error, lastCreatedDish} = useAppSelector(state => state.dish);

    // Dish data
    const [dishName, setDishName] = useState("");
    const [ingredients, setIngredients] = useState<DishFood[]>([]);

    // Child modals state
    const [showSelectIngredient, setShowSelectIngredient] = useState(false);
    const [showCreateIngredient, setShowCreateIngredient] = useState(false);

    // Calculate total weight from ingredients
    const totalWeight = useMemo(() => {
        return ingredients.reduce((sum, ing) => sum + (ing.weight || 0), 0);
    }, [ingredients]);

    // Add ingredient to list
    const handleAddIngredient = useCallback((food: Food, weight: number = 100) => {
        setIngredients(prev => [...prev, {foodId: food.id, weight, food}]);
        setShowSelectIngredient(false);
    }, []);

    // Create new ingredient and add to list
    const handleCreateIngredient = useCallback((food: Food) => {
        setIngredients(prev => [...prev, {foodId: food.id, weight: 100, food}]);
        setShowCreateIngredient(false);
    }, []);

    // Remove ingredient from list
    const handleRemoveIngredient = useCallback((index: number) => {
        setIngredients(prev => prev.filter((_, idx) => idx !== index));
    }, []);

    // Update ingredient weight
    const handleUpdateWeight = useCallback((index: number, weight?: number) => {
        setIngredients(prev =>
            prev.map((ing, idx) =>
                idx === index ? {...ing, weight} : ing
            )
        );
    }, []);

    // Handle successful dish creation - wait for backend response and pass correct dish object to callback
    useEffect(() => {
        if (success && !loading && lastCreatedDish) {
            const dishWithFoods: DishWithFoods = {
                ...lastCreatedDish,
                foods: ingredients
            };
            
            onSuccess?.(dishWithFoods, ingredients);
            resetForm();
            onClose();
        }
    }, [success, loading, lastCreatedDish, ingredients, onSuccess, onClose]);

    // Create dish
    const handleCreate = useCallback(() => {
        if (!dishName.trim() || totalWeight <= 0 || !user) return;

        // Dispatch to Redux
        dispatch(createDishRequest({
            name: dishName.trim(),
            ownerId: user.id!,
            weight: totalWeight,
            foods: ingredients.map(ing => ({
                foodId: ing.foodId,
                weight: ing.weight || 0
            }))
        }));
    }, [dishName, totalWeight, user, ingredients, dispatch]);

    // Close and reset
    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose]);

    const resetForm = () => {
        setDishName("");
        setIngredients([]);
        setShowSelectIngredient(false);
        setShowCreateIngredient(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-50">
                <div
                    className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-[520px] max-h-[85vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-1">Create New Dish</h3>
                    <p className="text-sm text-gray-500 mb-4">Name your dish and add ingredients with weights.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                            Creating dish...
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Dish name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Dish Name</label>
                            <input
                                type="text"
                                value={dishName}
                                onChange={(e) => setDishName(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Enter dish name"
                            />
                        </div>

                        {/* Total weight (calculated) */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Weight (g)</label>
                            <input
                                type="number"
                                value={totalWeight || ""}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-gray-100"
                                placeholder="Auto-calculated"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Sum of all ingredient weights
                            </p>
                        </div>

                        {/* Ingredients list */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Ingredients</label>
                                <button
                                    onClick={() => setShowSelectIngredient(true)}
                                    className="text-primary-500 hover:text-primary-700 text-sm"
                                >
                                    + Add
                                </button>
                            </div>

                            {ingredients.length > 0 ? (
                                <ul className="space-y-2">
                                    {ingredients.map((ing, idx) => (
                                        <li key={`${ing.foodId}-${idx}`} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                            <span className="flex-1 text-sm">{ing.food?.name || "Ingredient"}</span>
                                            <input
                                                type="number"
                                                value={ing.weight ?? ""}
                                                min="1"
                                                onChange={(e) => {
                                                    const weight = e.target.value === "" ? undefined : Number(e.target.value);
                                                    handleUpdateWeight(idx, weight);
                                                }}
                                                className="w-20 border rounded px-2 py-1 text-center text-sm"
                                                placeholder="g"
                                            />
                                            <button
                                                onClick={() => handleRemoveIngredient(idx)}
                                                className="text-red-500 hover:text-red-700 px-2"
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-4">No ingredients yet</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={handleClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={loading || !dishName.trim() || totalWeight <= 0}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {/* Child modals */}
            <SelectIngredientModal
                isOpen={showSelectIngredient}
                onClose={() => setShowSelectIngredient(false)}
                onSelectIngredient={handleAddIngredient}
                onCreateIngredient={() => {
                    setShowSelectIngredient(false);
                    setShowCreateIngredient(true);
                }}
                readyFoods={foods}
            />

            <CreateIngredientModal
                isOpen={showCreateIngredient}
                onClose={() => setShowCreateIngredient(false)}
                onCreateIngredient={handleCreateIngredient}
            />
        </>
    );
}
