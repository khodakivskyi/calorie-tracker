import {useState, useEffect} from "react";
import type {Food} from "../store/types/foodTypes.ts";

interface CreateIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateIngredient: (food: Food) => void;
}

export default function CreateIngredientModal({
    isOpen,
    onClose,
    onCreateIngredient}: CreateIngredientModalProps) {
    const [ingredient, setIngredient] = useState({ name: "", calories: 0, protein: 0, fat: 0, carbohydrates: 0 });

    useEffect(() => {
        if (!isOpen) {
            setIngredient({ name: "", calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
        }
    }, [isOpen]);

    const handleCreate = () => {
        if (!ingredient.name) return;
        
        const createdFood: Food = {
            id: Date.now(),
            name: ingredient.name,
            userId: 1,
            calories: ingredient.calories,
            proteins: ingredient.protein,
            fats: ingredient.fat,
            carbs: ingredient.carbohydrates,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        onCreateIngredient(createdFood);
        setIngredient({ name: "", calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
    };

    const handleClose = () => {
        setIngredient({ name: "", calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[70]">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">Create new ingredient</h3>
                
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
                            value={ingredient.calories || ""}
                            onChange={(e) => setIngredient({...ingredient, calories: parseFloat(e.target.value) || 0})}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Calories"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Protein (g)</label>
                            <input
                                type="number"
                                value={ingredient.protein || ""}
                                onChange={(e) => setIngredient({...ingredient, protein: parseFloat(e.target.value) || 0})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="P"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fat (g)</label>
                            <input
                                type="number"
                                value={ingredient.fat || ""}
                                onChange={(e) => setIngredient({...ingredient, fat: parseFloat(e.target.value) || 0})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="F"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Carbs (g)</label>
                            <input
                                type="number"
                                value={ingredient.carbohydrates || ""}
                                onChange={(e) => setIngredient({...ingredient, carbohydrates: parseFloat(e.target.value) || 0})}
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
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

