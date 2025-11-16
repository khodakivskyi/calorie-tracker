export default function DateSelector (){
    const days = [];
    const date = new Date();

    for (let i = -3; i <= 3; i++) {
        date.setDate(date.getDate() + i);

        const dayName = date.toLocaleDateString("en-US", {weekday: "short"});
        const day = date.getDate();
        const month = date.getMonth();

        days.push({dayName, day, month});
    }

    return (
        <div className="flex flex-row p-4 justify-between">
            {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center p-2 border-2 border-primary-900
                w-11 rounded-3xl cursor-pointer hover:bg-gray-100">
                    <span className="text-lg font-semibold">{day.day}</span>
                    <span className="text-sm text-gray-500">{day.dayName}</span>
                </div>
            ))}
        </div>
    )
}