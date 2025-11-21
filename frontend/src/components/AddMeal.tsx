import Breakfast from '../assets/images/Breakfast.png';
import Lunch from '../assets/images/Lunch.png';
import Snack from '../assets/images/Snack.png';
import Dinner from '../assets/images/Dinner.png';

export default function AddMeal() {
    const mealTypes = [
        {
            id: 'breakfast',
            name: 'Breakfast',
            imagePosition: 'right' as const,
            imageUrl: Breakfast
        },
        {
            id: 'lunch',
            name: 'Lunch',
            imagePosition: 'left' as const,
            imageUrl: Lunch
        },
        {
            id: 'snack',
            name: 'Snack',
            imagePosition: 'right' as const,
            imageUrl: Snack
        },
        {
            id: 'dinner',
            name: 'Dinner',
            imagePosition: 'left' as const,
            imageUrl: Dinner
        }
    ];

    return (
        <>
        {mealTypes.map((meal) => (
                <div key={meal.id} className="bg-white overflow-hidden rounded-2xl p-4 mb-4 h-36">
                    <div className={`flex justify-between items-start ${meal.imagePosition === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>

                        <div className={`${meal.imagePosition === 'right' ? 'flex-1' : 'items-end'}`}>
                            <h3 className="font-bold text-lg">{meal.name}</h3>
                            <button className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg">
                                + Add
                            </button>
                        </div>

                        <div
                            className={`
                            w-48 h-48
                            -m-4
                            overflow-hidden
                            relative
                            flex-shrink-0
                        `}
                        >
                            <img
                                src={meal.imageUrl}
                                alt={meal.name}
                                className={`${meal.imagePosition === 'right' ? 'bottom-10 left-10' : 'top-2 right-12'}
                            relative  
                            w-340 h-340
                            object-cover
                            
                        `}
                            />
                        </div>





                    </div>
                </div>
            ))}
        </>
    )
}