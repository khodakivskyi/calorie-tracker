/*import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import './App.css'

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
