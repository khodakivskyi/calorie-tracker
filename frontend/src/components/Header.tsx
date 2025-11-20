import {useAppSelector} from "../store";

export default function Header(){
    const {user} = useAppSelector(state => state.auth);

    const date = new Date();

    const formatted = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(date);

    return (
        <div>
            <h1 className="font-bold text-3xl leading-tight">Hello, {user!.name}</h1>
            <span className="font-normal text-lg text-gray-800">{formatted}</span>
        </div>
    )
}