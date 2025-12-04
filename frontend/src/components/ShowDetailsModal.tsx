import EditIcon from "../assets/icons/edit.svg?react";
import DeleteIcon from "../assets/icons/delete.svg?react";
import type {Food} from "../store/types/foodTypes.ts";

interface FoodInfoModalProps {
    isOpen: boolean;
    onClose: () => void;

    name: string;
    calories: number | null;
    proteins: number | null;
    fats: number | null;
    carbs: number | null;

    onEdit?: () => void;
    onDelete?: () => void;
    food: Food;

}

export default function FoodInfoModal({
        isOpen,
        onClose,
        name,
        calories,
        proteins,
        fats,
        carbs,
        onEdit,
        onDelete
        }: FoodInfoModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">

            <h3 className="text-lg font-bold mb-4">{name}</h3>

    <div className="space-y-3 text-sm">
    <div className="flex justify-between">
    <span className="text-gray-600">Calories:</span>
    <span className="font-medium">{calories ?? 0} kcal</span>
    </div>

    <div className="flex justify-between">
    <span className="text-gray-600">Proteins:</span>
    <span className="font-medium">{proteins ?? 0} g</span>
    </div>

    <div className="flex justify-between">
    <span className="text-gray-600">Fats:</span>
    <span className="font-medium">{fats ?? 0} g</span>
    </div>

    <div className="flex justify-between">
    <span className="text-gray-600">Carbs:</span>
    <span className="font-medium">{carbs ?? 0} g</span>
    </div>
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex gap-3 mt-6 justify-end">

        {/* EDIT */}
        <button
    onClick={() => {
        onEdit?.();
        onClose();
    }}
    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
    >
    <EditIcon className="w-6 h-6" />
        </button>

    {/* DELETE */}
    <button
        onClick={() => {
        onDelete?.();
        onClose();
    }}
    className="p-2 rounded-lg border border-gray-300 hover:bg-red-50"
    >
    <DeleteIcon className="w-6 h-6 text-red-500" />
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
