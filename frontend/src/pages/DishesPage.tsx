import {useEffect, useState} from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateDishModal from "../components/modals/CreateDishModal.tsx";
import SelectIngredientModal from "../components/modals/SelectIngredientModal.tsx";
import CreateIngredientModal from "../components/modals/CreateIngredientModal.tsx";
import type {DishFood, Dish} from "../store/types/dishTypes.ts";
import type {Food} from "../store/types/foodTypes.ts";
import {useAppDispatch, useAppSelector} from "../store";
import {createDishRequest, getDishesByUserRequest} from "../store/slices/dishesSlice.ts";
import { getFoodsByUserRequest } from '../store/slices/foodsSlice.ts';

export default function DishesPage() {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);
    const { foods } = useAppSelector(state => state.food)
    const { dishes, loading, error } = useAppSelector(state => state.dish);

    const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);
    const [isSelectIngredientOpen, setIsSelectIngredientOpen] = useState(false);
    const [newDishIngredients, setNewDishIngredients] = useState<DishFood[]>([]);

    useEffect(() => {
        if (user) {
            dispatch(getDishesByUserRequest({ ownerId: user.id }));
            dispatch(getFoodsByUserRequest({ ownerId: user.id }));
        }
    }, [dispatch, user]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleAddClick = () => {
        setIsCreateDishOpen(true);
    };

    const handleItemClick = (_dish: Dish) => {
        // TODO: navigate to dish detail page or open edit modal
    };

    const handleSelectIngredient = (food: Food, quantity = 1) => {
        setNewDishIngredients(prev => [...prev, { foodId: food.id, quantity, food }]);
        setIsSelectIngredientOpen(false);
    };

    const handleCreateIngredient = (food: Food) => {
        setNewDishIngredients(prev => [...prev, { foodId: food.id, quantity: 1, food }]);
        setIsCreateIngredientOpen(false);
    };

    const filteredDishes = searchQuery.trim()
        ? dishes.filter(dish => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : dishes;

    const resetModals = () => {
        setIsCreateDishOpen(false);
        setIsSelectIngredientOpen(false);
        setIsCreateIngredientOpen(false);
        setNewDishIngredients([]);
    };

    const handleCreateDish = (dish: Dish) => {
        if (user) {
            dispatch(createDishRequest({ ...dish, ownerId: user.id }));
        }
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

                {loading && <p className="text-center py-4">Loading...</p>}
                {error && <p className="text-red-500 text-center py-4">{error}</p>}

                <div className="pb-24">
                    {filteredDishes.length > 0 ? (
                        filteredDishes.map((dish) => (
                            <RecipeItemCard
                                key={dish.id}
                                id={dish.id}
                                name={dish.name}
                                calories={dish.calories ?? null}
                                onClick={() => handleItemClick(dish)}
                            />
                        ))
                    ) : (
                        !loading && (
                            <div className="bg-white rounded-2xl p-8 text-center">
                                <p className="text-gray-500">No dishes found</p>
                            </div>
                        )
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
                readyFoods={foods}
            />

            <CreateIngredientModal
                isOpen={isCreateIngredientOpen}
                onClose={() => setIsCreateIngredientOpen(false)}
                onCreateIngredient={handleCreateIngredient}
            />
        </div>
    );
}


