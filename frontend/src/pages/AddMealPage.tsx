import AddMeal from "../components/AddMeal.tsx";
import PageHeader from "../components/PageHeader.tsx";

export default function AddMealPage() {
    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Add Meals" />

            <div className="px-4">
                <AddMeal/>
            </div>
        </div>
    )
}