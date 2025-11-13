import {Outlet} from "react-router-dom";
import NavigationMenu from "./NavigationMenu.tsx";

export default function BaseLayout() {
    return (
        <div className="min-h-screen bg-green-50 pb-24">
            <Outlet />

            <NavigationMenu/>
        </div>
    )
}