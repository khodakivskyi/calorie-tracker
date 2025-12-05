import { useState } from 'react';
import AddIcon from '../assets/icons/add.svg?react';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    onAddClick?: () => void;
}

export default function SearchBar({ placeholder = "Search...", onSearch, onAddClick }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch?.(value);
    };

    return (
        <>
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>
            <button
                onClick={onAddClick}
                className="flex-shrink-0 w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center"
            >
                <AddIcon className="w-6 h-6" />
            </button>
        </div>
        </>
    );
}

