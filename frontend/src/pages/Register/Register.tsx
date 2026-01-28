import { SignUp as SignUpClerk } from "@clerk/clerk-react";

function SignUp() {
    return (
    <>
        <div className="flex flex-col h-screen bg-background-app-light dark:bg-background-app-dark">
            <SignUpClerk />
        </div>
    </>
    )
}

export default SignUp;