import EditIcon from "../../assets/icons/edit.svg?react";
import DeleteIcon from "../../assets/icons/delete.svg?react";
import FoodItemIcon from "../../assets/icons/food-item.svg?react";
import type {Dish} from "../../store/types/dishTypes.ts";

interface DishInfoModalProps {
    isOpen: boolean;
    onClose: () => void;

    dish: Dish;

    onEdit?: () => void;
    onDelete?: () => void;
}

export default function DishInfoModal({
                                          isOpen,
                                          onClose,
                                          dish,
                                          onEdit,
                                          onDelete,
                                      }: DishInfoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[420px] max-h-[80vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center mb-4 gap-2">
                    <FoodItemIcon className="w-8 h-8 text-gray-900"/>
                    <h3 className="text-lg font-bold">{dish.name}</h3>
                </div>

                {/* MAIN INFO */}
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{dish.weight} g</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Calories:</span>
                        <span className="font-medium">{dish.calories ?? 0} kcal</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Proteins:</span>
                        <span className="font-medium">{dish.protein ?? 0} g</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Fats:</span>
                        <span className="font-medium">{dish.fat ?? 0} g</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Carbs:</span>
                        <span className="font-medium">{dish.carbohydrate ?? 0} g</span>
                    </div>
                </div>

                {/* INGREDIENTS */}
                {dish.foods && dish.foods.length > 0 && (
                    <div className="mt-5">
                        <p className="text-sm font-semibold mb-2">Ingredients</p>

                        <ul className="space-y-2 text-sm">
                            {dish.foods.map((df) => (
                                <li
                                    key={`${dish.id}-${df.foodId}`}
                                    className="flex justify-between border rounded-md px-3 py-2 bg-gray-50"
                                >
                                    <span className="text-gray-700">
                                        {df.food?.name ?? "Unknown food"}
                                    </span>
                                    <span className="text-gray-600">
                                        {df.weight ?? 0} g
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-6 justify-end">
                    <button
                        onClick={() => {
                            onEdit?.();
                            onClose();
                        }}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        <EditIcon className="w-6 h-6"/>
                    </button>

                    <button
                        onClick={() => {
                            onDelete?.();
                            onClose();
                        }}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-red-50"
                    >
                        <DeleteIcon className="w-6 h-6 text-red-500"/>
                    </button>
                </div>

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded mt-6"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
