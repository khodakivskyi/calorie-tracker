import { Routes, Route } from 'react-router-dom'
import RegisterPage from "./pages/RegisterPage.tsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import MainPage from "./pages/MainPage.tsx"
import ProfilePage from "./pages/ProfilePage.tsx"
import BaseLayout from "./components/BaseLayout.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<BaseLayout/>}>
                <Route path="/home" element={<MainPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    )
}

export default App