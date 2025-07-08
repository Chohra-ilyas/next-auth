"use client";

import { loginAction } from "@/actions/auth.action";
import Alert from "@/components/Alert";
import Spinner from "@/components/spinner";
import { loginSchema } from "@/utils/validationSchemas";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdLogIn } from "react-icons/io";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return setClientError(validation.error.errors[0].message);
    }
    try {
      setLoading(true);
      setClientError("");
      setServerError("");
      setServerSuccess("");

      loginAction({ email, password }).then((res) => {
        if (!res?.success) {
          setServerSuccess("");
          setServerError(res.message);
        } else if (res?.success) {
          setServerError("");
          setServerSuccess(res.message);
        }
      });
    } finally {
      setLoading(false);
      setClientError("");
      setServerError("");
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

      <div className="flex justify-center items-center gap-4 mt-2">
        <button
          type="button"
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" />
          <span className="hidden sm:inline">Google</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
        >
          <FaGithub className="text-xl" />
          <span className="hidden sm:inline">GitHub</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
