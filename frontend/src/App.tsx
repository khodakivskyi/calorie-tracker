import { Routes, Route } from 'react-router-dom'
import RegisterPage from "./pages/RegisterPage.tsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"

function App() {
    return (
        <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    )
}

export default App