import {useState, useMemo} from "react";
import type {Dish} from "../../store/types/dishTypes.ts";

interface SelectDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDish: (dish: Dish) => void;
    onCreateDish: () => void;
    readyDishes: Dish[];
}

export default function SelectDishModal({
    isOpen,
    onClose,
    onSelectDish,
    onCreateDish,
    readyDishes
}: SelectDishModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDishes = useMemo(() => {
        if (!searchQuery.trim()) return readyDishes;
        
        const query = searchQuery.toLowerCase();
        return readyDishes.filter(dish =>
            dish.name.toLowerCase().includes(query)
        );
    }, [readyDishes, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Select or create a dish</h3>
                
                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Search dishes..."
                    />
                </div>

                {/* Ready dishes list */}
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ready dishes:</h4>
                    {filteredDishes.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredDishes.map((dish) => (
                                <button
                                    key={dish.id}
                                    onClick={() => onSelectDish(dish)}
                                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">{dish.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Weight: {dish.weight}g
                                        {dish.calories && ` | ${dish.calories} kcal`}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            {searchQuery ? "No dishes found" : "No dishes available"}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                    <button
                        onClick={onCreateDish}
                        className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Create your own dish
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
