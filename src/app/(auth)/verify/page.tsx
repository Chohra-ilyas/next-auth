import { verifyEmailAction } from "@/actions/verification.action";
import { GoVerified } from "react-icons/go";
import { VscError } from "react-icons/vsc";

interface VerifyPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

const VerifyPage = async ({ searchParams }: VerifyPageProps) => {
  const currentSearchParams = await searchParams;
  const result = await verifyEmailAction(currentSearchParams.token);
  return (
    <div className="text-center">
      {result.success ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <GoVerified className="text-green-500 text-8xl" />
          <h1 className="text-2xl font-bold">Your Email Has Been Verified</h1>
          <p className="mt-4">Thank you for verifying your email address.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <VscError className="text-red-500 text-8xl" />
          <h1 className="text-2xl font-bold">Email Verification Failed</h1>
          <p className="mt-4">{result.message}</p>
        </div>
      )}
      <p className="mt-4">
        You can now{" "}
        <a href="/login" className="text-blue-500">
          log in
        </a>{" "}
        with your account.
      </p>
    </div>
  );
};

export default VerifyPage;
