interface RecipeItemCardProps {
    id: number;
    name: string;
    calories: number;
    onClick?: () => void;
}

export default function RecipeItemCard({ name, calories, onClick }: RecipeItemCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 mb-3 cursor-pointer"
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{name}</h3>
                    <span className="text-sm text-gray-600">{calories} Cal</span>
                </div>
            </div>
        </div>
    );
}

