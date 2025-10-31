import {useEffect, useState} from "react";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const token = params.get("token");

        if (!userId || !token) {
            setStatus("error");
            setMessage("Invalid verification link");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch("http://localhost:5066/graphql", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        query: `
                            mutation VerifyEmail($userId: Int!, $token: String!) {
                            verifyEmail(userId: $userId, token: $token)}
                            `,
                        variables: {userId: Number(userId), token},
                    }),
                });

                const result = await response.json();

                if (result.data?.verifyEmail === true) {
                    setStatus("success");
                    setMessage("✅ Email successfully verified! You can now log in.");
                } else {
                    setStatus("error");
                    setMessage("Verification failed. Please try again or request a new link.");
                }
            } catch (error) {
                setStatus("error");
                console.error(error);
                setMessage("Verification failed. Please try again or request a new link.");
            }
        };

        (async () => {
            await verifyEmail();
        })();

    }, []);

    return (
        <div style={{textAlign: "center", marginTop: "3rem"}}>
            {status === "loading" && <p>Verifying your email...</p>}
            {status === "success" && <p style={{color: "green"}}>{message}</p>}
            {status === "error" && <p style={{color: "red"}}>{message}</p>}
        </div>
    );
}