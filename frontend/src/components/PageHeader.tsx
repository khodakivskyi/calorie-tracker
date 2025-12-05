import {useNavigate} from "react-router-dom";
import ArrowBackIcon from '../assets/icons/arrow-back.svg?react';

interface PageHeaderProps {
    title: string;
}

export default function PageHeader({title}: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white px-4 py-3 mb-4">
            <div className="flex items-center justify-center relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 p-1 text-gray-800 hover:text-gray-600 transition-colors flex items-center justify-center"
                >
                    <ArrowBackIcon className="w-6 h-6" />
                </button>

                <h1 className="text-base font-bold text-black">{title}</h1>
            </div>
        </div>
    );
}

