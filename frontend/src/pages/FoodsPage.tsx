import { useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";

interface Food {
    id: number;
    name: string;
    calories: number;
}

// Mock data for foods
const mockFoods: Food[] = [
    { id: 1, name: 'Chicken Breast', calories: 165 },
    { id: 2, name: 'Brown Rice', calories: 112 },
    { id: 3, name: 'Broccoli', calories: 34 },
    { id: 4, name: 'Salmon', calories: 206 },
    { id: 5, name: 'Sweet Potato', calories: 86 },
    { id: 6, name: 'Avocado', calories: 160 },
    { id: 7, name: 'Eggs', calories: 155 },
    { id: 8, name: 'Oatmeal', calories: 68 },
    { id: 9, name: 'Banana', calories: 105 },
    { id: 10, name: 'Greek Yogurt', calories: 100 },
    { id: 11, name: 'Almonds', calories: 164 },
    { id: 12, name: 'Spinach', calories: 23 },
];

export default function FoodsPage() {
    const [foods, setFoods] = useState<Food[]>(mockFoods);

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
        console.log('Add new food');///do
    };

    const handleItemClick = (food: Food) => {
        console.log('View food:', food);///do
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
                                calories={food.calories}
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
        </div>
    );
}

