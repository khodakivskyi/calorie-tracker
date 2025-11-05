import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {verifyEmail} from "../store/slices/thunks/authThunk";

export default function VerifyEmailPage() {
    const dispatch = useAppDispatch();
    const {verificationStatus, error} = useAppSelector(state => state.auth);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const token = params.get("token");

        if (userId && token) {
            dispatch(verifyEmail({userId: Number(userId), token}));
        }
    }, [dispatch]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-16 w-16 text-primary-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Верифікація email...</h2>
                        <p className="text-gray-600">Зачекайте, будь ласка</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 rounded-full p-6 mb-6">
                            <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Email підтверджено! 🎉</h2>
                        <p className="text-gray-600 mb-8 text-center max-w-md">
                            Ваш email успішно верифіковано. Тепер ви можете увійти в систему та почати користуватися додатком.
                        </p>
                        <a 
                            href="/login" 
                            className="bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            Увійти в систему
                        </a>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex flex-col items-center">
                        <div className="bg-red-100 rounded-full p-6 mb-6">
                            <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Помилка верифікації</h2>
                        <p className="text-gray-600 mb-8 text-center max-w-md">
                            {error || "Не вдалося верифікувати email. Посилання може бути застарілим або недійсним."}
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="/register" 
                                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
                            >
                                Зареєструватися знову
                            </a>
                            <a 
                                href="/login" 
                                className="bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Спробувати увійти
                            </a>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center">
                        <div className="bg-yellow-100 rounded-full p-6 mb-6">
                            <svg className="h-16 w-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Недійсне посилання</h2>
                        <p className="text-gray-600 mb-8 text-center max-w-md">
                            Посилання для верифікації недійсне або відсутнє. Будь ласка, перевірте ваш email та спробуйте знову.
                        </p>
                        <a 
                            href="/register" 
                            className="bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            На головну
                        </a>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}