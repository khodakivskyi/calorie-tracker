import RegisterForm from "../components/RegisterForm.tsx";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Створити акаунт
                        </h1>
                    </div>

                    <RegisterForm/>
                </div>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Реєструючись, ви погоджуєтесь з{' '}
                    <a href="#" className="text-primary-600 hover:underline">Умовами використання</a>
                    {' '}та{' '}
                    <a href="#" className="text-primary-600 hover:underline">Політикою конфіденційності</a>
                </p>
            </div>
        </div>
    )
}