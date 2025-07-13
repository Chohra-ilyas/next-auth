"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/components/Alert";
import Spinner from "@/components/spinner";
import { useState } from "react";
import Link from "next/link";
import { GrPowerReset } from "react-icons/gr";
import { resetPasswordSchema } from "@/utils/validationSchemas";
import { resetPasswordAction } from "@/actions/password.action";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });
    if (!validation.success) {
      return setClientError(validation.error.errors[0].message);
    }
    console.log("Token:", token);
    if (!token) {
      return setClientError("Invalid or missing token");
    }
    setLoading(true);
    resetPasswordAction({ newPassword, confirmPassword }, token)
      .then((response) => {
        if (response.success) {
          setServerSuccess(response.message);
          setServerError("");
          setClientError("");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
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
      <div className="relative">
        <label
          className="block mb-1 text-gray-700 font-semibold"
          htmlFor="newPassword"
        >
          New Password
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          id="newPassword"
          placeholder="Enter your new password"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {showNewPassword ? (
          <FaEyeSlash
            className="absolute right-3 top-12 transform -translate-y-1/6 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
        ) : (
          <FaEye
            className="absolute right-3 top-12 transform -translate-y-1/6 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
        )}
      </div>
      <div className="relative">
        <label
          className="block mb-1 text-gray-700 font-semibold"
          htmlFor="confirmPassword"
        >
          Confirm New Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="confirmPassword"
          placeholder="Confirm your new password"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {showConfirmPassword ? (
          <FaEyeSlash
            className="absolute right-3 top-12 transform -translate-y-1/6 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        ) : (
          <FaEye
            className="absolute right-3 top-12 transform -translate-y-1/6 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        )}
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
            <GrPowerReset className="text-xl" /> Reset
          </>
        )}
      </button>
      <div>
        <Link href="/login" className="text-blue-600 hover:underline">
          <span className="text-gray-600 font-bold">
            Remembered your password?
          </span>{" "}
          Login
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
