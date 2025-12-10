import type {Dish, DishFood} from "../../store/types/dishTypes.ts";
import {useState, useMemo} from "react";

interface CreateDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateDish: (dish: Dish) => void;
    onAddIngredient: () => void;
    ingredients: DishFood[];
    onRemoveIngredient: (index: number) => void;
    onUpdateIngredientWeight?: (index: number, weight: number) => void;
}

export default function CreateDishModal({
    isOpen,
    onClose,
    onCreateDish,
    onAddIngredient,
    ingredients,
    onRemoveIngredient,
    onUpdateIngredientWeight}: CreateDishModalProps) {
    const [dishName, setDishName] = useState("");

    const calculatedDishWeight = useMemo(() => {
        return ingredients.reduce((total, ingredient) => {
            return total + (ingredient.weight || 0);
        }, 0);
    }, [ingredients]);

    const handleCreate = () => {
        if (!dishName || calculatedDishWeight <= 0) return;
        
        const createdDish: Dish = {
            id: Date.now(),
            name: dishName,
            ownerId: 1,
            weight: calculatedDishWeight,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        onCreateDish(createdDish);
        setDishName("");
    };

    const handleClose = () => {
        setDishName("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Create new dish</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Dish name</label>
                        <input
                            type="text"
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Total Weight (g)</label>
                        <input
                            type="number"
                            value={calculatedDishWeight || ""}
                            disabled={true}
                            className="w-full border rounded px-3 py-2 bg-gray-100"
                            placeholder="Calculated automatically"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Sum of all ingredient weights
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Ingredients:</label>
                            <button
                                onClick={onAddIngredient}
                                className="text-primary-500 hover:text-primary-700 text-sm"
                            >
                                + Add ingredient
                            </button>
                        </div>
                        {ingredients.length > 0 ? (
                            <ul className="space-y-1">
                                {ingredients.map((dishFood, idx) => (
                                    <li key={idx}
                                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded gap-2">
                                        <span className="flex-1">{dishFood.food?.name || "Ingredient"}</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={dishFood.weight || 0}
                                            onChange={(e) => {
                                                const weight = Number(e.target.value) || 0;
                                                if (onUpdateIngredientWeight) {
                                                    onUpdateIngredientWeight(idx, weight);
                                                }
                                            }}
                                            className="w-20 border rounded px-2 py-1 text-center"
                                            placeholder="g"
                                        />
                                        <button
                                            onClick={() => onRemoveIngredient(idx)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove ingredient"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-xs">No ingredients</p>
                        )}
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

