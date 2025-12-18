import {Outlet} from "react-router-dom";
import NavigationMenu from "./NavigationMenu.tsx";

export default function BaseLayout() {
    return (
        <div className="h-full bg-gray-200 p-4">
            <Outlet />

            <NavigationMenu/>
        </div>
    )
}