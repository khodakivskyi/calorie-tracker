import LoginForm from "../components/auth/LoginForm.tsx";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Log In
                        </h1>
                    </div>

                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}