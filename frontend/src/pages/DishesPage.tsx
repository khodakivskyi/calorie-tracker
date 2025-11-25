import { useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";

interface Dish {
    id: number;
    name: string;
    calories: number;
}

// Mock data for dishes
const mockDishes: Dish[] = [
    { id: 1, name: 'Chicken Breast with Rice', calories: 450 },
    { id: 2, name: 'Broccoli Salad', calories: 120 },
    { id: 3, name: 'Salmon with Potatoes', calories: 520 },
    { id: 4, name: 'Avocado Toast', calories: 280 },
    { id: 5, name: 'Caesar Salad', calories: 320 },
    { id: 6, name: 'Greek Salad', calories: 250 },
    { id: 7, name: 'Pasta Carbonara', calories: 680 },
    { id: 8, name: 'Grilled Vegetables', calories: 180 },
    { id: 9, name: 'Beef Steak', calories: 550 },
    { id: 10, name: 'Vegetable Stir Fry', calories: 220 },
];

export default function DishesPage() {
    const [dishes, setDishes] = useState<Dish[]>(mockDishes);

    const handleSearch = (query: string) => {
        if (query.trim() === '') {
            setDishes(mockDishes);
        } else {
            const filtered = mockDishes.filter(dish =>
                dish.name.toLowerCase().includes(query.toLowerCase())
            );
            setDishes(filtered);
        }
    };

    const handleAddClick = () => {
        console.log('Add new dish');///do
    };

    const handleItemClick = (dish: Dish) => {
        console.log('View dish:', dish);///do
    };

    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Dishes" />

            <div className="px-4">
                <SearchBar
                    placeholder="Search dishes..."
                    onSearch={handleSearch}
                    onAddClick={handleAddClick}
                />

                <div className="pb-24">
                    {dishes.length > 0 ? (
                        dishes.map((dish) => (
                            <RecipeItemCard
                                key={dish.id}
                                id={dish.id}
                                name={dish.name}
                                calories={dish.calories}
                                onClick={() => handleItemClick(dish)}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <p className="text-gray-500">No dishes found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

