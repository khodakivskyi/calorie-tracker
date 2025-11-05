/*import {useState} from 'react'*/

//react-router-dom

import RegisterPage from "./pages/RegisterPage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";

function App() {
    const currentPath = window.location.pathname;
    if (currentPath === "/verify-email") {
        return <VerifyEmailPage />;
    }

    return <RegisterPage />
}

export default App
