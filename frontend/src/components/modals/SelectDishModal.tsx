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
    readyDishes }: SelectDishModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Select or create a dish</h3>
                
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ready dishes:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {readyDishes.map((dish) => (
                            <button
                                key={dish.id}
                                onClick={() => onSelectDish(dish)}
                                className="w-full text-left p-3 border rounded hover:bg-gray-50"
                            >
                                <div className="font-medium">{dish.name}</div>
                                <div className="text-sm text-gray-600">Weight: {dish.weight}g</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onCreateDish}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg mb-2"
                >
                    Create your own dish
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

