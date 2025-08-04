import { LoginForm } from "@/components/Auth/login-form";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

function LoginFormFallback() {
	return (
			<div className="flex w-full items-center justify-center gap-x-2">
					<BeatLoader className="h-8 w-8"/>
			</div>
	)
} 

const LoginPage = () => {
  return (
    <div>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm/>
      </Suspense>
    </div>
  );
};

export default LoginPage;