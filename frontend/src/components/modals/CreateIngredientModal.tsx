import { useState, useEffect } from "react";
import type { Food } from "../../store/types/foodTypes.ts";

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

    useEffect(() => {
        if (!isOpen) {
            setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
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

    const handleCreate = () => {
        if (!ingredient.name) return;

        const createdFood: Food = {
            id: foodToEdit?.id ?? Date.now(),
            name: ingredient.name,
            ownerId: 1,
            calories: ingredient.calories === "" ? 0 : parseFloat(ingredient.calories),
            protein: ingredient.protein === "" ? 0 : parseFloat(ingredient.protein),
            fat: ingredient.fat === "" ? 0 : parseFloat(ingredient.fat),
            carbohydrate: ingredient.carbohydrate === "" ? 0 : parseFloat(ingredient.carbohydrate),
            createdAt: foodToEdit?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onCreateIngredient(createdFood);

        setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
    };

    const handleClose = () => {
        setIngredient({ name: "", calories: "", protein: "", fat: "", carbohydrate: "" });
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
                        className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg"
                    >
                        {foodToEdit ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
