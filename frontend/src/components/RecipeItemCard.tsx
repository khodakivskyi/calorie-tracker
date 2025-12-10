import InfoIcon from "../assets/icons/info.svg?react";
import FoodItemIcon from "../assets/icons/food-item.svg?react";

interface RecipeItemCardProps {
    id: number;
    name: string;
    calories: number | null;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function RecipeItemCard({
                                           name,
                                           calories,
                                           onClick,
                                       }: RecipeItemCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 mb-3 cursor-pointer"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 gap-3">
                    <FoodItemIcon className="w-8 h-8 text-gray-900" />
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <span className="text-sm text-gray-600">{calories ?? 0} Cal</span>
                    </div>
                </div>

                <div className="ml-3">
                    <InfoIcon className="w-6 h-6 text-gray-900" />
                </div>
            </div>
        </div>
    );
}
