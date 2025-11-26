import type {Food} from "../store/types/foodTypes.ts";

interface SelectIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIngredient: (food: Food, quantity?: number) => void;
    onCreateIngredient: () => void;
    readyFoods: Food[];
}

export default function SelectIngredientModal({
    isOpen,
    onClose,
    onSelectIngredient,
    onCreateIngredient,
    readyFoods }: SelectIngredientModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Select or create ingredient</h3>
                
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ready ingredients:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {readyFoods.map((food) => (
                            <button
                                key={food.id}
                                onClick={() => onSelectIngredient(food, 1)}
                                className="w-full text-left p-3 border rounded hover:bg-gray-50"
                            >
                                <div className="font-medium">{food.name}</div>
                                <div className="text-sm text-gray-600">
                                    {food.calories} kcal | P: {food.protein}g, F: {food.fat}g, C: {food.carbohydrates}g
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onCreateIngredient}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg mb-2"
                >
                    Create your own ingredient
                </button>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-300 px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

