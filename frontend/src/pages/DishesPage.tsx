import { useState } from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateDishModal from "../components/CreateDishModal.tsx";
import SelectIngredientModal from "../components/SelectIngredientModal.tsx";
import CreateIngredientModal from "../components/CreateIngredientModal.tsx";
import type {DishFood, Dish as DishType} from "../store/types/dishTypes.ts";
import type {Food} from "../store/types/foodTypes.ts";

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

const readyFoods: Food[] = [
    { id: 101, name: "Chicken Breast", ownerId: null, calories: 165, protein: 31, fat: 3.6, carbohydrates: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 102, name: "Brown Rice", ownerId: null, calories: 112, protein: 2.6, fat: 0.9, carbohydrates: 23, createdAt: new Date(), updatedAt: new Date() },
    { id: 103, name: "Broccoli", ownerId: null, calories: 34, protein: 2.8, fat: 0.4, carbohydrates: 7, createdAt: new Date(), updatedAt: new Date() },
];

export default function DishesPage() {
    const [dishes, setDishes] = useState<Dish[]>(mockDishes);
    const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);
    const [isSelectIngredientOpen, setIsSelectIngredientOpen] = useState(false);
    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [newDishIngredients, setNewDishIngredients] = useState<DishFood[]>([]);

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
        setIsCreateDishOpen(true);
    };

    const handleItemClick = (dish: Dish) => {
        console.log('View dish:', dish);///do
    };

    const handleSelectIngredient = (food: Food, quantity = 1) => {
        setNewDishIngredients(prev => [...prev, { foodId: food.id, quantity, food }]);
        setIsSelectIngredientOpen(false);
    };

    const handleCreateIngredient = (food: Food) => {
        setNewDishIngredients(prev => [...prev, { foodId: food.id, quantity: 1, food }]);
        setIsCreateIngredientOpen(false);
    };

    const resetModals = () => {
        setIsCreateDishOpen(false);
        setIsSelectIngredientOpen(false);
        setIsCreateIngredientOpen(false);
        setNewDishIngredients([]);
    };

    const handleCreateDish = (dish: DishType) => {
        const calories = dish.foods?.reduce((sum, item) => {
            const kcal = item.food?.calories ?? 0;
            return sum + kcal * item.quantity;
        }, 0) ?? 0;

        setDishes(prev => [...prev, {
            id: dish.id,
            name: dish.name,
            calories: Math.round(calories)
        }]);
        resetModals();
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

            <CreateDishModal
                isOpen={isCreateDishOpen}
                onClose={resetModals}
                onCreateDish={handleCreateDish}
                onAddIngredient={() => setIsSelectIngredientOpen(true)}
                ingredients={newDishIngredients}
                onRemoveIngredient={(index) =>
                    setNewDishIngredients(prev => prev.filter((_, idx) => idx !== index))
                }
            />

            <SelectIngredientModal
                isOpen={isSelectIngredientOpen}
                onClose={() => setIsSelectIngredientOpen(false)}
                onSelectIngredient={handleSelectIngredient}
                onCreateIngredient={() => {
                    setIsSelectIngredientOpen(false);
                    setIsCreateIngredientOpen(true);
                }}
                readyFoods={readyFoods}
            />

            <CreateIngredientModal
                isOpen={isCreateIngredientOpen}
                onClose={() => setIsCreateIngredientOpen(false)}
                onCreateIngredient={handleCreateIngredient}
            />
        </div>
    );
}

