"use client";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.action";
import Alert from "@/components/Alert";
import Spinner from "@/components/spinner";
import { loginSchema } from "@/utils/validationSchemas";
import { useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import SocialProviders from "@/components/SocialProviders";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        return setClientError(validation.error.errors[0].message);
      }
  
      try {
        setLoading(true);
        const res = await loginAction({ email, password });
        if (!res?.success) {
          setServerSuccess("");
          setServerError(res.message);
        } else if (res?.success) {
          setServerError("");
          setServerSuccess(res.message);
          router.replace("/profile");
        }
      } finally {
        setLoading(false);
        setClientError("");
        setEmail("");
        setPassword("");
      }
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

      <div>
        <label
          className="block mb-1 text-gray-700 font-semibold"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          placeholder="Enter your password"
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
            <IoMdLogIn className="text-xl" /> Login
          </>
        )}
      </button>
      <SocialProviders />
    </form>
  );
};

export default LoginForm;
