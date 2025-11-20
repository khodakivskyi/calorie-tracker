export default function AddMeal() {
    const mealTypes = [
        {
            id: 'breakfast',
            name: 'Breakfast',
            imagePosition: 'right' as const,
            imageUrl: '/images/breakfast.jpg'
        },
        {
            id: 'lunch',
            name: 'Lunch',
            imagePosition: 'left' as const,
            imageUrl: '/images/lunch.jpg'
        },
        {
            id: 'snack',
            name: 'Snack',
            imagePosition: 'right' as const,
            imageUrl: '/images/snack.jpg'
        },
        {
            id: 'dinner',
            name: 'Dinner',
            imagePosition: 'left' as const,
            imageUrl: '/images/dinner.jpg'
        }
    ];

    return (
        <>
        {mealTypes.map((meal) => (
                <div key={meal.id} className="bg-white rounded-2xl p-4 mb-4">
                    <div className={`flex items-center ${meal.imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>

                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{meal.name}</h3>
                            <button className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg">
                                + Add
                            </button>
                        </div>

                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            {meal.imageUrl && (
                                <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover"/>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}