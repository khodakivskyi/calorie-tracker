import {useNavigate} from "react-router-dom";
import Lunch from '../assets/images/Lunch.png';
import Foods from '../assets/images/Foods.png';

export default function RecipeTiles() {
    const navigate = useNavigate();

    const tiles = [
        {
            id: 'dishes',
            name: 'Dishes',
            imageUrl: Lunch,
            imagePosition: 'right' as const,
            route: '/recipes/dishes'
        },
        {
            id: 'foods',
            name: 'Foods',
            imageUrl: Foods,
            imagePosition: 'left' as const,
            route: '/recipes/foods'
        }
    ];

    const handleTileClick = (route: string) => {
        navigate(route);
    };

    return (
        <>
            {tiles.map((tile) => (
                <div 
                    key={tile.id}
                    onClick={() => handleTileClick(tile.route)}
                    className="bg-white overflow-hidden rounded-2xl p-6 mb-4 h-[12rem] cursor-pointer"
                >
                    <div className={`flex justify-between items-center h-full ${tile.imagePosition === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`flex flex-col justify-center ${tile.imagePosition === 'right' ? 'flex-1' : 'items-end flex-1'}`}>
                            <h3 className="font-bold text-2xl mb-4">{tile.name}</h3>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTileClick(tile.route);
                                }}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg w-fit"
                            >
                                View All
                            </button>
                        </div>

                        <div
                            className={`
                                w-56 h-56
                                -m-6
                                overflow-hidden
                                relative
                                flex-shrink-0
                            `}
                        >
                            <img
                                src={tile.imageUrl}
                                alt={tile.name}
                                className={`
                                    ${tile.imagePosition === 'right' ? 'bottom-10 left-10' : 'top-10 right-12'}
                                    relative  
                                    w-[340px] h-[340px]
                                    object-cover
                                `}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

