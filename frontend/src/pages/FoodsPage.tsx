import { useEffect, useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateIngredientModal from "../components/CreateIngredientModal.tsx";
import type { Food } from "../store/types/foodTypes.ts";
import { useAppDispatch, useAppSelector } from '../store';
import {
    createFoodRequest,
    updateFoodRequest,
    getFoodsByUserRequest
} from '../store/slices/foodsSlice.ts';

export default function FoodsPage() {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);
    const { foods, loading, error } = useAppSelector(state => state.food);

    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<Food | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    // Завантаження фудів користувача
    useEffect(() => {
        if (user) {
            dispatch(getFoodsByUserRequest({ userId: user.id }));
        }
    }, [dispatch, user]);

    const filteredFoods = searchQuery.trim()
        ? foods.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : foods;

    const handleAddClick = () => {
        setFoodToEdit(undefined); // створюємо новий фуд
        setIsCreateIngredientOpen(true);
    };

    // Викликається при створенні або редагуванні фуда
    const handleSaveFood = (food: Food) => {
        if (!user) return;

        if (foodToEdit) {
            // Редагування → формуємо payload для updateFoodRequest
            dispatch(updateFoodRequest({
                foodId: food.id,
                userId: user.id,
                name: food.name,
                calories: food.calories ?? undefined,
                proteins: food.proteins ?? undefined,
                fats: food.fats ?? undefined,
                carbs: food.carbs ?? undefined,
                imageId: food.imageId ?? undefined,
            }));
        } else {
            // Створення
            dispatch(createFoodRequest({
                name: food.name,
                userId: user.id,
                calories: food.calories ?? undefined,
                protein: food.proteins ?? undefined,
                fat: food.fats ?? undefined,
                carbohydrates: food.carbs ?? undefined,
                imageId: food.imageId ?? undefined,
            }));

        }

        setIsCreateIngredientOpen(false);
        setFoodToEdit(undefined);
    };


    const handleEditClick = (food: Food) => {
        setFoodToEdit(food);
        setIsCreateIngredientOpen(true);
    };

    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Foods" />

            <div className="px-4">
                <SearchBar
                    placeholder="Search foods..."
                    onSearch={setSearchQuery}
                    onAddClick={handleAddClick}
                />

                {loading && <p className="text-center py-4">Loading...</p>}
                {error && <p className="text-red-500 text-center py-4">{error}</p>}

                <div className="pb-24">
                    {filteredFoods.length > 0 ? (
                        filteredFoods.map((food) => (
                            <RecipeItemCard
                                key={food.id}
                                id={food.id}
                                name={food.name}
                                calories={food.calories ?? 0}
                                onClick={() => handleEditClick(food)}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <p className="text-gray-500">No foods found</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateIngredientModal
                isOpen={isCreateIngredientOpen}
                onClose={() => {
                    setIsCreateIngredientOpen(false);
                    setFoodToEdit(undefined);
                }}
                onCreateIngredient={handleSaveFood}
                foodToEdit={foodToEdit}
            />
        </div>
    );
}
