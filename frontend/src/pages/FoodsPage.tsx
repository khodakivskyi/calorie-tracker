import { useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateIngredientModal from "../components/CreateIngredientModal.tsx";
import type { Food } from "../store/types/foodTypes.ts";

const mockFoods: Food[] = [
    { id: 1, name: 'Chicken Breast', calories: 165, userId: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Brown Rice', calories: 112, userId: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'Broccoli', calories: 34, userId: null, createdAt: new Date(), updatedAt: new Date() },
];

export default function FoodsPage() {
    const [foods, setFoods] = useState<Food[]>(mockFoods);
    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);

    const handleSearch = (query: string) => {
        if (query.trim() === '') {
            setFoods(mockFoods);
        } else {
            const filtered = mockFoods.filter(food =>
                food.name.toLowerCase().includes(query.toLowerCase())
            );
            setFoods(filtered);
        }
    };

    const handleAddClick = () => {
        setIsCreateIngredientOpen(true);
    };

    const handleItemClick = (food: Food) => {
        console.log('View food:', food);
    };

    const handleCreateIngredient = (food: Food) => {
        setFoods(prev => [...prev, food]);
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

                <div className="pb-24">
                    {foods.length > 0 ? (
                        foods.map((food) => (
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
