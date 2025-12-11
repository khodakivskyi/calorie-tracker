import {useState, useMemo} from "react";
import type {Food} from "../../store/types/foodTypes.ts";

interface SelectIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIngredient: (food: Food, weight?: number) => void;
    onCreateIngredient: () => void;
    readyFoods: Food[];
}

export default function SelectIngredientModal({
    isOpen,
    onClose,
    onSelectIngredient,
    onCreateIngredient,
    readyFoods
}: SelectIngredientModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFoods = useMemo(() => {
        if (!searchQuery.trim()) return readyFoods;
        
        const query = searchQuery.toLowerCase();
        return readyFoods.filter(food =>
            food.name.toLowerCase().includes(query)
        );
    }, [readyFoods, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Select or create ingredient</h3>
                
                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Search ingredients..."
                    />
                </div>

                {/* Ready ingredients list */}
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ready ingredients:</h4>
                    {filteredFoods.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredFoods.map((food) => (
                                <button
                                    key={food.id}
                                    onClick={() => onSelectIngredient(food, 100)}
                                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {food.calories ?? 0} kcal | P: {food.protein ?? 0}g, F: {food.fat ?? 0}g, C: {food.carbohydrate ?? 0}g
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            {searchQuery ? "No ingredients found" : "No ingredients available"}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                    <button
                        onClick={onCreateIngredient}
                        className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create your own ingredient
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
