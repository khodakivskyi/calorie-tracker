import { useNavigate } from "react-router-dom";
import Lunch from "../assets/images/Lunch.png";
import Foods from "../assets/images/Foods.png";
import { useState } from "react";

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

export default function RecipesPage() {
    const navigate = useNavigate();
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(tiles.map(() => false));

    const allImagesLoaded = imagesLoaded.every(Boolean);

    const handleTileClick = (route: string) => {
        navigate(route);
    };

    const handleImageLoad = (index: number) => {
        setImagesLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    return (
        <>
            {/* LOADER */}
            {!allImagesLoaded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-white text-sm opacity-80">
                            Loading recipes...
                        </span>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className={allImagesLoaded ? '' : 'pointer-events-none select-none'}>
                {tiles.map((tile, index) => (
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

                            <div className="w-56 h-56 -m-6 overflow-hidden relative flex-shrink-0">
                                <img
                                    src={tile.imageUrl}
                                    alt={tile.name}
                                    onLoad={() => handleImageLoad(index)}
                                    className={`
                                        ${tile.imagePosition === 'right' ? 'bottom-10 left-10' : 'top-10 right-12'}
                                        relative  
                                        w-[230px] h-[230px]
                                        object-cover
                                        transition-opacity duration-500
                                        ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'}
                                    `}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
