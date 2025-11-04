import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {verifyEmail} from "../store/slices/thunks/authThunk";

export default function VerifyEmailPage() {
    const dispatch = useAppDispatch();
    const {verificationStatus, error} = useAppSelector(state => state.auth);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const token = params.get("token");

        if (userId && token) {
            dispatch(verifyEmail({userId: Number(userId), token}));
        }
    }, [dispatch]);

    const renderMessage = () => {
        switch (verificationStatus) {
            case 'loading':
                return <p>Verifying your email...</p>;
            case 'success':
                return <p>✅ Email successfully verified! You can now log in.</p>;
            case 'error':
                return <p>{error || "Verification failed. Please try again or request a new link."}</p>;
            default:
                return <p>Invalid verification link</p>;
        }
    };

    return (
        <div style={{textAlign: "center", marginTop: "3rem"}}>
            {renderMessage()}
        </div>
    );
}