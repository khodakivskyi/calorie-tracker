import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from "../store/slices/thunks/authThunk.ts";
import type {RootState, AppDispatch} from "../store";

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
        <form onSubmit={handleSubmit} >
            <input type="text" value={email} required={true}
                   onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required={true} value={password}
                   onChange={(e) => setPassword(e.target.value)} />
            <input type="text" value={name}
                   onChange={(e) => setName(e.target.value)} />

            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userEmail && <p>Letter send to your email</p>}
        </form>
    )
}
