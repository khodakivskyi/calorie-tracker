import { useEffect, useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateIngredientModal from "../components/modals/CreateIngredientModal.tsx";
import type { Food } from "../store/types/foodTypes.ts";
import { useAppDispatch, useAppSelector } from '../store';
import {
    createFoodRequest,
    updateFoodRequest,
    getFoodsByUserRequest,
    deleteFoodRequest
} from '../store/slices/foodsSlice.ts';

export default function FoodsPage() {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);
    const { foods, loading, error } = useAppSelector(state => state.food);

    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<Food | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(getFoodsByUserRequest({ ownerId: user.id }));
        }
    }, [dispatch, user]);

    const filteredFoods = searchQuery.trim()
        ? foods.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : foods;

    const handleAddClick = () => {
        setFoodToEdit(undefined); // створюємо новий фуд
        setIsCreateIngredientOpen(true);
    };

    const handleSaveFood = (food: Food) => {
        if (!user) return;

        if (foodToEdit) {
            dispatch(updateFoodRequest({
                foodId: food.id,
                ownerId: user.id,
                name: food.name,
                calories: food.calories ?? undefined,
                protein: food.protein ?? undefined,
                fat: food.fat ?? undefined,
                carbohydrate: food.carbohydrate ?? undefined,
                imageId: food.imageId ?? undefined,
            }));
        } else {
            dispatch(createFoodRequest({
                name: food.name,
                ownerId: user.id,
                calories: food.calories ?? undefined,
                protein: food.protein ?? undefined,
                fat: food.fat ?? undefined,
                carbohydrate: food.carbohydrate ?? undefined,
                imageId: food.imageId ?? undefined,
            }));

        }

        loading ? setIsCreateIngredientOpen(true) : setIsCreateIngredientOpen(false);
        setFoodToEdit(undefined);
    };


    const handleEditClick = (food: Food) => {
        setFoodToEdit(food);
        setIsCreateIngredientOpen(true);
    };

    const handleDeleteFood = (id: number) => {
        if (!user) return;
        dispatch(deleteFoodRequest({
            foodId: id,
            ownerId: user.id,
        }));
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
                                onEdit={() => handleEditClick(food)}
                                onDelete={() => handleDeleteFood(food.id)}
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
