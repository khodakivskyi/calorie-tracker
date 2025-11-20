import DateSelector from "../components/DateSelector.tsx";
import Header from "../components/Header.tsx";

export default function MainPage() {
    return (
        <div className="min-h-screen pb-24">
            <Header />
            <DateSelector/>
        </div>
    )
}