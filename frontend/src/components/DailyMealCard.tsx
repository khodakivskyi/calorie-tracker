//import InfoIcon from "../assets/icons/info.svg?react";
//import FoodItemIcon from "../assets/icons/food-item.svg?react";

interface DailyMealCardProps {
    name: string;
    calories: number | null;
    onClick?: () => void;
}

export default function DailyMealCard({
                                          name,
                                          calories,
                                          onClick,
                                      }: DailyMealCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 gap-3">
                    {/*<FoodItemIcon className="w-8 h-8" />*/}
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                        <span className="text-sm text-gray-600">{calories} kcal</span>
                    </div>
                </div>

                <div className="ml-3">
                    {/*<InfoIcon className="w-6 h-6 text-gray-900" />*/}
                </div>
            </div>
        </div>
    );
}
