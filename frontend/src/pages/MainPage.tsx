import DateSelector from "../components/DateSelector.tsx";
import Header from "../components/Header.tsx";
import Dashboard from "../components/Dashboard.tsx";
import {Link} from 'react-router-dom';

export default function MainPage() {
    return (
        <div className="min-h-screen pb-24">
            <Header/>
            <DateSelector/>
            <Dashboard/>
            {/*TODO: if meals==0*/}
            <Link to="/add-meal">
                <div className="mt-8 px-4">
                    <button
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
                        + Add Meals
                    </button>
                </div>
            </Link>
        </div>
    )
}