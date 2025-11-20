import {useNavigate} from "react-router-dom";
import AddMeal from "../components/AddMeal.tsx";

export default function AddMealPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-green-100 p-4">
            <div className="flex flex-row">
                <button onClick={()=> navigate(-1)}>Back</button>
                <h1>Add meals</h1>
            </div>

            <AddMeal/>
        </div>
    )
}