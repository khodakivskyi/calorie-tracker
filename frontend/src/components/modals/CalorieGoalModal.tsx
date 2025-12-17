import React, { useState, useEffect } from 'react';

interface CalorieLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLimit: number;
    onSave: (newLimit: number) => void;
}

export default function CalorieLimitModal({ isOpen, onClose, currentLimit, onSave }: CalorieLimitModalProps) {
    const [calories, setCalories] = useState<number>(2000);

    useEffect(() => {
        if (isOpen) {
            setCalories(currentLimit || 2000);
        }
    }, [isOpen, currentLimit]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalories(Number(e.target.value));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setCalories(val);
    };

    const handleBlur = () => {
        setCalories(calories);
    };

    const handleSave = () => {
        if (calories <= 0) {
            onSave(-1);
        } else {
            onSave(calories);
        }
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200 border border-gray-100">

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-800">Daily Calorie Goal</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-8 px-2">
                    <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                        <span>1000 kcal</span>
                        <span>5000 kcal</span>
                    </div>
                    <input
                        type="range"
                        min="1000"
                        max="5000"
                        step="100"
                        value={calories}
                        onChange={handleSliderChange}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        Selected Limit
                    </label>
                    <div className="relative max-w-[160px] mx-auto">
                        <input
                            type="number"
                            value={calories}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            min="1000"
                            max="5000"
                            className="w-full px-4 py-3 text-center text-2xl font-bold text-primary-600 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                            kcal
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    );
}