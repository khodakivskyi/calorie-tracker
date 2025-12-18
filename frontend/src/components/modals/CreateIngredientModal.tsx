import { useState, useEffect, useRef } from "react";
import type { Food } from "../../store/types/foodTypes.ts";
import { useAppDispatch, useAppSelector } from "../../store";
import { createFoodRequest, clearLastCreatedFood } from "../../store/slices/foodsSlice.ts";

interface CreateIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateIngredient: (food: Food) => void;
    foodToEdit?: Food;
}

export default function CreateIngredientModal({
                                                  isOpen,
                                                  onClose,
                                                  onCreateIngredient,
                                                  foodToEdit
                                              }: CreateIngredientModalProps) {
    const [ingredient, setIngredient] = useState({
        name: "",
        calories: "",
        protein: "",
        fat: "",
        carbohydrate: ""
    });
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { loading, success, error, lastCreatedFood } = useAppSelector(state => state.food);
    const processedFoodIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
            processedFoodIdRef.current = null;
        } else if (foodToEdit) {
            setIngredient({
                name: foodToEdit.name ?? "",
                calories: foodToEdit.calories?.toString() ?? "",
                protein: foodToEdit.protein?.toString() ?? "",
                fat: foodToEdit.fat?.toString() ?? "",
                carbohydrate: foodToEdit.carbohydrate?.toString() ?? "",
            });
        }
    }, [isOpen, foodToEdit]);

    // Handle successful food creation - wait for backend response and pass correct food object to callback
    useEffect(() => {
        if (success && !loading && lastCreatedFood && isOpen) {
            if (processedFoodIdRef.current !== lastCreatedFood.id) {
                processedFoodIdRef.current = lastCreatedFood.id;
                onCreateIngredient(lastCreatedFood);
                setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
                dispatch(clearLastCreatedFood());
                onClose();
            }
        }
    }, [success, loading, lastCreatedFood, isOpen, onCreateIngredient, onClose, dispatch]);

    const parseNumberOrNull = (value: string) => value === "" ? null : parseFloat(value);

    const handleCreate = () => {
        if (!ingredient.name) return;

        dispatch(createFoodRequest({
            ownerId: user?.id ?? null,
            name: ingredient.name,
            calories: parseNumberOrNull(ingredient.calories),
            protein: parseNumberOrNull(ingredient.protein),
            fat: parseNumberOrNull(ingredient.fat),
            carbohydrate: parseNumberOrNull(ingredient.carbohydrate),
        }));
    };

    const handleClose = () => {
        setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-[70]">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-[480px]">
                <h3 className="text-xl font-bold mb-2">
                    {foodToEdit ? "Edit ingredient" : "Create new ingredient"}
                </h3>
                    <p className="text-sm text-gray-500 mb-4">
                    Set nutrition per 100g and reuse it in dishes.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                        Creating ingredient...
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ingredient name</label>
                        <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => setIngredient({...ingredient, name: e.target.value})}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Calories (per 100g)</label>
                        <input
                            type="number"
                            value={ingredient.calories}
                            onChange={(e) => setIngredient({...ingredient, calories: e.target.value})}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Calories"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Protein (g)</label>
                            <input
                                type="number"
                                value={ingredient.protein}
                                onChange={(e) => setIngredient({...ingredient, protein: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="P"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fat (g)</label>
                            <input
                                type="number"
                                value={ingredient.fat}
                                onChange={(e) => setIngredient({...ingredient, fat: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="F"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Carbohydrates (g)</label>
                            <input
                                type="number"
                                value={ingredient.carbohydrate}
                                onChange={(e) => setIngredient({...ingredient, carbohydrate: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="C"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 bg-gray-300 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading || !ingredient.name.trim()}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                    >
                        {foodToEdit ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
