import {useEffect, useState} from 'react';
import PageHeader from "../components/PageHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import RecipeItemCard from "../components/RecipeItemCard.tsx";
import CreateDishModal from "../components/modals/CreateDishModal.tsx";
import type {Dish} from "../store/types/dishTypes.ts";
import {useAppDispatch, useAppSelector} from "../store";
import {getDishesByUserRequest} from "../store/slices/dishesSlice.ts";
import {getFoodsByUserRequest} from '../store/slices/foodsSlice.ts';

/**
 * Page for managing user's dishes.
 * Shows list of dishes and allows creating new ones.
 */
export default function DishesPage() {
    const dispatch = useAppDispatch();

    const {user} = useAppSelector(state => state.auth);
    const {dishes, loading, error} = useAppSelector(state => state.dish);

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);

    // Load dishes and foods on mount
    useEffect(() => {
        if (user) {
            dispatch(getDishesByUserRequest({ownerId: user.id}));
            dispatch(getFoodsByUserRequest({ownerId: user.id}));
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

    // Filter dishes by search query
    const filteredDishes = searchQuery.trim()
        ? dishes.filter(dish => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : dishes;

    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Dishes"/>

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

            {/* Create dish modal - fully self-contained */}
            <CreateDishModal
                isOpen={isCreateDishOpen}
                onClose={() => setIsCreateDishOpen(false)}
            />
        </div>
    );
}
