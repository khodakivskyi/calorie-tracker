import PageHeader from "../components/PageHeader.tsx";
import RecipeTiles from "../components/RecipeTiles.tsx";

export default function RecipesPage() {
    return (
        <div className="min-h-screen bg-green-100">
            <PageHeader title="Recipes" />

            <div className="px-4">
                <RecipeTiles/>
            </div>
        </div>
    )
}