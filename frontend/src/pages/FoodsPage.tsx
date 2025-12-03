import { useEffect, useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateIngredientModal from "../components/CreateIngredientModal.tsx";
import type { Food } from "../store/types/foodTypes.ts";
import { useAppDispatch, useAppSelector } from '../store';
import { createFoodRequest, getFoodsByUserRequest } from '../store/slices/foodsSlice.ts';

export default function FoodsPage() {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);
    const { foods, loading, error } = useAppSelector(state => state.food);

    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(getFoodsByUserRequest({ userId: user.id }));
        }
    }, [dispatch, user]);

    const filteredFoods = searchQuery.trim()
        ? foods.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : foods;

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleAddClick = () => {
        setIsCreateIngredientOpen(true);
    };

    const handleItemClick = (food: Food) => {
        console.log('View food:', food);
    };

    const handleCreateIngredient = (food: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (user) {
            dispatch(createFoodRequest({ ...food, userId: 1 }));
        }
        setIsCreateIngredientOpen(false);
    };

    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Foods" />

            <div className="px-4">
                <SearchBar
                    placeholder="Search foods..."
                    onSearch={handleSearch}
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
                                calories={food.calories ?? null}
                                onClick={() => handleItemClick(food)}
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
                onClose={() => setIsCreateIngredientOpen(false)}
                onCreateIngredient={handleCreateIngredient}
            />
        </div>
    );
}
