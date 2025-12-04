import { useState, useEffect } from "react";
import type { Food } from "../store/types/foodTypes.ts";

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
        carbohydrates: ""
    });

    useEffect(() => {
        if (!isOpen) {
            setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrates: "" });
        } else if (foodToEdit) {
            setIngredient({
                name: foodToEdit.name ?? "",
                calories: foodToEdit.calories?.toString() ?? "",
                protein: foodToEdit.proteins?.toString() ?? "",
                fat: foodToEdit.fats?.toString() ?? "",
                carbohydrates: foodToEdit.carbs?.toString() ?? "",
            });
        }
    }, [isOpen, foodToEdit]);

    const handleCreate = () => {
        if (!ingredient.name) return;

        const createdFood: Food = {
            id: foodToEdit?.id ?? Date.now(),
            name: ingredient.name,
            userId: 1,
            calories: ingredient.calories === "" ? 0 : parseFloat(ingredient.calories),
            proteins: ingredient.protein === "" ? 0 : parseFloat(ingredient.protein),
            fats: ingredient.fat === "" ? 0 : parseFloat(ingredient.fat),
            carbs: ingredient.carbohydrates === "" ? 0 : parseFloat(ingredient.carbohydrates),
            createdAt: foodToEdit?.createdAt ?? new Date(),
            updatedAt: new Date(),
        };

        onCreateIngredient(createdFood);

        setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrates: "" });
    };

    const handleClose = () => {
        setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrates: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[70]">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">
                    {foodToEdit ? "Edit ingredient" : "Create new ingredient"}
                </h3>

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
                            <label className="block text-sm font-medium mb-1">Carbs (g)</label>
                            <input
                                type="number"
                                value={ingredient.carbohydrates}
                                onChange={(e) => setIngredient({...ingredient, carbohydrates: e.target.value})}
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
                        className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg"
                    >
                        {foodToEdit ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
