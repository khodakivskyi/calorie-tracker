import {useEffect, useState, useMemo, useCallback} from "react";
import {useAppDispatch, useAppSelector} from "../../store";
import {updateDishRequest} from "../../store/slices/dishesSlice.ts";
import type {Dish, DishFood} from "../../store/types/dishTypes.ts";
import SelectIngredientModal from "./SelectIngredientModal.tsx";
import CreateIngredientModal from "./CreateIngredientModal.tsx";

interface UpdateDishModalProps {
    isOpen: boolean;
    dish: Dish | null;
    onClose: () => void;
}

/**
 * Modal for updating an existing dish (name and weight).
 * Available only for dishes owned by current user.
 */
export default function UpdateDishModal({isOpen, dish, onClose}: UpdateDishModalProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    const {foods} = useAppSelector(state => state.food);

    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState<DishFood[]>([]);
    const [showSelectIngredient, setShowSelectIngredient] = useState(false);
    const [showCreateIngredient, setShowCreateIngredient] = useState(false);

    // Sync state when opening or when dish changes
    useEffect(() => {
        if (isOpen && dish) {
            setName(dish.name ?? "");
            setIngredients(dish.foods ?? []);
        } else {
            resetForm();
        }
    }, [isOpen, dish]);

    const canEdit = useMemo(() => {
        if (!dish || !user) return false;
        return dish.ownerId === user.id;
    }, [dish, user]);

    const handleSave = useCallback(() => {
        if (!dish || !user || !canEdit) return;
        const totalWeight = ingredients.reduce((sum, ing) => sum + (ing.weight || 0), 0);
        if (!name.trim() || totalWeight <= 0) return;

        dispatch(updateDishRequest({
            dishId: dish.id,
            ownerId: user.id,
            name: name.trim(),
            weight: totalWeight
        }));

        onClose();
    }, [dish, user, canEdit, name, ingredients, dispatch, onClose]);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose]);

    const resetForm = () => {
        setName("");
        setIngredients([]);
        setShowSelectIngredient(false);
        setShowCreateIngredient(false);
    };

    const totalWeight = useMemo(() => {
        return ingredients.reduce((sum, ing) => sum + (ing.weight || 0), 0);
    }, [ingredients]);

    const handleAddIngredient = useCallback((food: any, weight: number = 100) => {
        setIngredients(prev => [...prev, {foodId: food.id, weight, food}]);
        setShowSelectIngredient(false);
    }, []);

    const handleCreateIngredient = useCallback((food: any) => {
        setIngredients(prev => [...prev, {foodId: food.id, weight: 100, food}]);
        setShowCreateIngredient(false);
    }, []);

    const handleRemoveIngredient = useCallback((index: number) => {
        setIngredients(prev => prev.filter((_, idx) => idx !== index));
    }, []);

    const handleUpdateWeight = useCallback((index: number, weight?: number) => {
        setIngredients(prev =>
            prev.map((ing, idx) =>
                idx === index ? {...ing, weight} : ing
            )
        );
    }, []);

    if (!isOpen || !dish) return null;

    return (
        <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-[520px] max-h-[85vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-1">Update Dish</h3>
                <p className="text-sm text-gray-500 mb-4">Change dish name, weights and ingredients.</p>

                {!canEdit && (
                    <p className="text-red-500 text-sm mb-3">
                        You can edit only dishes you own.
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Dish Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter dish name"
                            disabled={!canEdit}
                        />
                    </div>

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

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Ingredients</label>
                            <button
                                onClick={() => setShowSelectIngredient(true)}
                                className="text-primary-500 hover:text-primary-700 text-sm disabled:text-gray-400"
                                disabled={!canEdit}
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
                                                const value = e.target.value;
                                                const weight = value === "" ? undefined : Number(value);
                                                handleUpdateWeight(idx, weight);
                                            }}
                                            className="w-20 border rounded px-2 py-1 text-center text-sm"
                                            placeholder="g"
                                            disabled={!canEdit}
                                        />
                                        <button
                                            onClick={() => handleRemoveIngredient(idx)}
                                            className="text-red-500 hover:text-red-700 px-2 disabled:text-gray-400"
                                            title="Remove"
                                            disabled={!canEdit}
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

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canEdit || !name.trim() || totalWeight <= 0}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
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

