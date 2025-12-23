import {Outlet} from "react-router-dom";
import NavigationMenu from "./NavigationMenu.tsx";

export default function BaseLayout() {
    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Outlet />

            <NavigationMenu/>
        </div>
    )
}