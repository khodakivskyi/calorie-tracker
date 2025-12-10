import type {Meal, MealDish} from "../../store/types/mealTypes.ts";
import type {Food} from "../../store/types/foodTypes.ts";
import type {Dish, DishFood} from "../../store/types/dishTypes.ts";
import {useState, useEffect} from "react";
import SelectDishModal from "./SelectDishModal.tsx";
import CreateDishModal from "./CreateDishModal.tsx";
import SelectIngredientModal from "./SelectIngredientModal.tsx";
import CreateIngredientModal from "./CreateIngredientModal.tsx";
import {useAppSelector, useAppDispatch} from "../../store";
import {getFoodsByUserRequest} from "../../store/slices/foodsSlice.ts";
import {getDishesByUserRequest} from "../../store/slices/dishesSlice.ts";

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMeal: (meal: Meal) => void;
    mealType: string;
}

export default function AddMealModal({isOpen, onClose, onAddMeal, mealType}: AddMealModalProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    const {foods} = useAppSelector(state => state.food);
    const {dishes} = useAppSelector(state => state.dish);

    const [mealDishes, setMealDishes] = useState<MealDish[]>([]);

    useEffect(() => {
        if (isOpen && user) {
            if (foods.length === 0) {
                dispatch(getFoodsByUserRequest({ownerId: user.id}));
            }
            if (dishes.length === 0) {
                dispatch(getDishesByUserRequest({ownerId: user.id}));
            }
        }
    }, [isOpen, user, dispatch, foods.length, dishes.length]);
    
    const [showAddDishModal, setShowAddDishModal] = useState(false);
    const [showCreateDishModal, setShowCreateDishModal] = useState(false);

    const [showAddIngredientModal, setShowAddIngredientModal] = useState<number | null>(null);
    const [showCreateIngredientModal, setShowCreateIngredientModal] = useState<number | null>(null);

    const [newDishIngredients, setNewDishIngredients] = useState<DishFood[]>([]);

    const [currentDishForIngredient, setCurrentDishForIngredient] = useState<number | null>(null);

    //
    const handleAddReadyDish = (dish: Dish) => {
        setMealDishes([...mealDishes, {dishId: dish.id, weight: 120, dish}]);
        setShowAddDishModal(false);
    };

    const handleAddIngredientToDish = (dishId: number, food: Food, weight: number = 100) => {
        setMealDishes(mealDishes.map(md => {
            if (md.dishId === dishId && md.dish) {
                const updatedDish: Dish & { foods?: DishFood[] } = {
                    ...md.dish,
                    foods: [...((md.dish as Dish & { foods?: DishFood[] }).foods || []), {foodId: food.id, weight, food}]
                };
                return {...md, dish: updatedDish};
            }
            return md;
        }));
        setShowAddIngredientModal(null);
    };

    const handleCreateIngredient = (food: Food) => {
        if (currentDishForIngredient) {
            handleAddIngredientToDish(currentDishForIngredient, food, 1);
        }
        setCurrentDishForIngredient(null);
        setShowCreateIngredientModal(null);
    };

    const handleAddIngredientToNewDish = (food: Food, weight: number = 100) => {
        setNewDishIngredients([...newDishIngredients, {foodId: food.id, weight, food}]);
        setShowAddIngredientModal(null);
    };

    const handleCreateIngredientForNewDish = (food: Food) => {
        setNewDishIngredients([...newDishIngredients, {foodId: food.id, weight: 100, food}]);
        setShowCreateIngredientModal(null);
    };

    const handleRemoveDish = (dishId: number) => {
        setMealDishes(mealDishes.filter(md => md.dishId !== dishId));
    };

    //
    const handleRemoveIngredient = (dishId: number, foodId: number) => {
        setMealDishes(mealDishes.map(md => {
            if (md.dishId === dishId && md.dish) {
                const updatedDish: Dish & { foods?: DishFood[] } = {
                    ...md.dish,
                    foods: ((md.dish as Dish & { foods?: DishFood[] }).foods || []).filter((f: DishFood) => f.foodId !== foodId)
                };
                return {...md, dish: updatedDish};
            }
            return md;
        }));
    };

    const handleSubmit = () => {
        const newMeal: Meal = {
            id: 1,
            name: "test",//mealType or custom
            ownerId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };


        onAddMeal(newMeal);
        setMealDishes([]);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="bg-white p-6 rounded-lg w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Add {mealType}</h2>

                    {/* List of added dishes */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Dishes</h3>
                            <button
                                onClick={() => setShowAddDishModal(true)}
                                className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                + Add dish
                            </button>
                        </div>

                        {mealDishes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No dishes added yet</p>
                        ) : (
                            <div className="space-y-3">
                                {mealDishes.map((mealDish) => (
                                    <div key={mealDish.dishId} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">{mealDish.dish?.name || "Dish"}</h4>
                                                <p className="text-sm text-gray-600">Weight: {mealDish.dish?.weight || 0}g</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveDish(mealDish.dishId)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Dish ingredients */}
                                        <div className="mt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="text-sm font-medium text-gray-700">Ingredients:</h5>
                                                <button
                                                    onClick={() => {
                                                        setShowAddIngredientModal(mealDish.dishId);
                                                        setCurrentDishForIngredient(mealDish.dishId);
                                                    }}
                                                    className="text-primary-500 hover:text-primary-700 text-xs"
                                                >
                                                    + Add ingredient
                                                </button>
                                            </div>
                                            {(mealDish.dish as Dish & { foods?: DishFood[] })?.foods && (mealDish.dish as Dish & { foods?: DishFood[] }).foods!.length > 0 ? (
                                                <ul className="space-y-1">
                                                    {(mealDish.dish as Dish & { foods?: DishFood[] }).foods!.map((dishFood: DishFood) => (
                                                        <li key={dishFood.foodId}
                                                            className="flex justify-between items-center text-sm bg-white p-2 rounded">
                                                            <span>{dishFood.food?.name || "Ingredient"} - {dishFood.weight}g</span>
                                                            <button
                                                                onClick={() => handleRemoveIngredient(mealDish.dishId, dishFood.foodId)}
                                                                className="text-red-500 hover:text-red-700 ml-2"
                                                            >
                                                                ×
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-400 text-xs">No ingredients</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button onClick={handleSubmit} className="bg-primary-500 text-white px-4 py-2 rounded-lg">Add
                        </button>
                    </div>
                </div>
            </div>

            <SelectDishModal
                isOpen={showAddDishModal}
                onClose={() => setShowAddDishModal(false)}
                onSelectDish={handleAddReadyDish}
                onCreateDish={() => {
                    setShowAddDishModal(false);
                    setShowCreateDishModal(true);
                }}
                readyDishes={dishes}
            />

            <CreateDishModal
                isOpen={showCreateDishModal}
                onClose={() => {
                    setShowCreateDishModal(false);
                    setNewDishIngredients([]);
                }}
                onCreateDish={(dish) => {
                    setMealDishes([...mealDishes, {dishId: dish.id, weight: 120, dish}]);
                    setNewDishIngredients([]);
                    setShowCreateDishModal(false);
                }}
                onAddIngredient={() => {
                    setShowAddIngredientModal(-1);
                    setCurrentDishForIngredient(null);
                }}
                ingredients={newDishIngredients}
                onRemoveIngredient={(idx) => setNewDishIngredients(newDishIngredients.filter((_, i) => i !== idx))}
            />

            <SelectIngredientModal
                isOpen={showAddIngredientModal !== null}
                onClose={() => setShowAddIngredientModal(null)}
                onSelectIngredient={(food, weight = 100) => {
                    if (showAddIngredientModal === -1) {
                        handleAddIngredientToNewDish(food, weight);
                    } else if (showAddIngredientModal !== null) {
                        handleAddIngredientToDish(showAddIngredientModal, food, weight);
                    }
                }}
                onCreateIngredient={() => {
                    setShowAddIngredientModal(null);
                    setShowCreateIngredientModal(showAddIngredientModal);
                }}
                readyFoods={foods}
            />

            <CreateIngredientModal
                isOpen={showCreateIngredientModal !== null}
                onClose={() => {
                    setShowCreateIngredientModal(null);
                }}
                onCreateIngredient={(food) => {
                    if (showCreateIngredientModal === -1) {
                        handleCreateIngredientForNewDish(food);
                    } else {
                        handleCreateIngredient(food);
                    }
                }}
            />
        </>
    );
}