"use client";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import Spinner from "@/components/spinner";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import Link from "next/link";
import { forgotPasswordSchema } from "@/utils/validationSchemas";
import { z } from "zod";
import { forgotPasswordAction } from "@/actions/password.action";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      return setClientError(validation.error.errors[0].message);
    }
    setLoading(true);
    forgotPasswordAction({ email })
      .then((response) => {
        if (response.success) {
          setServerSuccess(response.message);
          setServerError("");
          setClientError("");
          setEmail(""); // Clear email input on success
          setTimeout(() => {
            router.push("/login");
          }, 2000); // Redirect after 2 seconds
        } else {
          setServerError(response.message);
          setServerSuccess("");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in forgotPasswordAction:", error);
        setServerError("An unexpected error occurred. Please try again later.");
        setServerSuccess("");
        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-6 rounded-xl"
    >
      <div>
        <label
          className="block mb-1 text-gray-700 font-semibold"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {(clientError || serverError) && (
        <Alert type="error" message={clientError || serverError} />
      )}
      {serverSuccess && <Alert type="success" message={serverSuccess} />}
      <button
        disabled={loading}
        type="submit"
        className="disabled:opacity-50 disabled:bg-gray-300 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition"
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <CiMail className="text-xl" /> Submit
          </>
        )}
      </button>
      <div>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          <span className="text-gray-600 font-bold">
            Remembered your password?
          </span>{" "}
          Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
