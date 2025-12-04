import EditIcon from '../assets/icons/edit.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';

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
    onDelete,
    }: RecipeItemCardProps) {
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

                <div className="flex items-center gap-3 ml-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                        className="p-2 rounded-lg border border-gray-300"
                    >
                        <EditIcon className="w-6 h-6"/>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="p-2 rounded-lg border border-gray-300"
                    >
                        <DeleteIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
