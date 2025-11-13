import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/icons/home.svg?react';
import AnalyticsIcon from '../assets/icons/analytics.svg?react';
import AddIcon from '../assets/icons/add.svg?react';
import PlanIcon from '../assets/icons/plan.svg?react';
import SettingIcon from '../assets/icons/setting.svg?react';
import React from "react";

type IconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

const iconMap: Record<string, IconComponent> = {
    home: HomeIcon,
    analytics: AnalyticsIcon,
    plan: PlanIcon,
    setting: SettingIcon,
};

const navItems = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/analytics', icon: 'analytics', label: 'Analytics'},
    {path: '/plan', icon: 'plan', label: 'Plan'},
    {path: '/setting', icon: 'setting', label: 'Setting'},
];

export default function NavigationMenu() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const leftItems = navItems.slice(0, 2);
    const rightItems = navItems.slice(2);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-primary-50 pb-safe">
            <div className="mx-auto max-w-md bg-white rounded-t-3xl shadow-lg px-4 py-2">
                <div className="flex items-center justify-around">
                    {leftItems.map((item) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center py-2 px-3 ${
                                    isActive(item.path) ? 'text-primary-500' : 'text-gray-600'
                                }`}
                            >
                                <IconComponent className="w-6 h-6" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    })}

                    <Link
                        to="/add"
                        className="flex items-center justify-center -mt-8">
                        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                            <AddIcon className="w-8 h-8 text-white" />
                        </div>
                    </Link>

                    {rightItems.map((item) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center py-2 px-3 ${
                                    isActive(item.path) ? 'text-primary-500' : 'text-gray-600'
                                }`}
                            >
                                <IconComponent className="w-6 h-6" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}