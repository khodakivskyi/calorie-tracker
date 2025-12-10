import {useEffect, useState} from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateIngredientModal from "../components/modals/CreateIngredientModal.tsx";
import FoodInfoModal from "../components/modals/FoodInfoModal.tsx";
import type {Food} from "../store/types/foodTypes.ts";
import {useAppDispatch, useAppSelector} from '../store';
import {
    createFoodRequest,
    updateFoodRequest,
    getFoodsByUserRequest,
    deleteFoodRequest
} from '../store/slices/foodsSlice.ts';

export default function FoodsPage() {
    const dispatch = useAppDispatch();

    const {user} = useAppSelector(state => state.auth);
    const {foods, loading, error, success} = useAppSelector(state => state.food);

    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [isFoodInfoOpen, setIsFoodInfoOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<Food | undefined>(undefined);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(getFoodsByUserRequest({ownerId: user.id}));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (success) {
            setIsCreateIngredientOpen(false);
            setFoodToEdit(undefined);
        }
    }, [success]);

    const filteredFoods = searchQuery.trim()
        ? foods.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : foods;

    const handleAddClick = () => {
        setFoodToEdit(undefined);
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
            <PageHeader title="Foods"/>

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
                        filteredFoods.map(food => (
                            <div key={food.id}>
                                <RecipeItemCard
                                    id={food.id}
                                    name={food.name}
                                    calories={food.calories ?? 0}
                                    onClick={() => {
                                        setSelectedFood(food);
                                        setIsFoodInfoOpen(true);
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <p className="text-gray-500">No foods found</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedFood && (
                <FoodInfoModal
                    isOpen={isFoodInfoOpen}
                    onClose={() => setIsFoodInfoOpen(false)}
                    name={selectedFood.name}
                    calories={selectedFood.calories}
                    protein={selectedFood.protein ?? 0}
                    fat={selectedFood.fat ?? 0}
                    carbohydrate={selectedFood.carbohydrate ?? 0}
                    food={selectedFood}
                    onEdit={() => {
                        setFoodToEdit(selectedFood);
                        setIsCreateIngredientOpen(true);
                        setIsFoodInfoOpen(false);
                    }}
                    onDelete={() => {
                        handleDeleteFood(selectedFood.id);
                        setIsFoodInfoOpen(false);
                    }}
                />
            )}

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
