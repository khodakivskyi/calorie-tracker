/*
import {userState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from "../store/slices/thunks/authThunk.ts";
import {RootState, AppDispatch} from "../store";

export default function RegisterForm() {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, userEmail} = useSelector((state: RootState)=> state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(registerUser({email, password, name: name || undefined}))
    }

    return (

    )
}
*/