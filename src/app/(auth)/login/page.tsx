import Link from "next/link";
import React from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login Page</h1>
        <LoginForm />
        <p className="mt-4 text-center text-gray-600">
          Do not have an account?
          <Link href="/register" className="ml-1 text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
